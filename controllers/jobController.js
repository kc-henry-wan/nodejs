const {Job, Pharmacist, PharmacyGroup, PharmacyBranch} = require('../models');

const {Op} = require('sequelize');

// Get all job with filtering and sorting
exports.getAllJobs = async (req, res) => {
    try {
        const {
            fromLat,
            fromLng,
            fromDate,
            toDate,
            statusCode,
            jobIds,
            groupCode,
            sortingSeq
        } = req.query;

        const jobIdArray = jobIds ? jobIds.split(',').map(Number) : []; // Split by comma and convert to numbers

        // Create filters based on request parameters
        const filters = {};

        if (fromDate && toDate) {
            filters.job_date = {
                [Op.between]: [new Date(fromDate), new Date(toDate)],
            };
        }

        if (statusCode) {
            filters.status_code = statusCode;
        }

        if (jobIdArray.length > 0) {
            filters.job_id = {
                [Op.in]: jobIdArray,
            };
        }

        // Define sorting order based on sortingSeq parameter
        let order;
        switch (sortingSeq) {
            case 'DA': // Sort by job_date ascending
                order = [['job_date', 'ASC']];
                break;
            case 'HR': // Sort by hourly_rate descending
                order = [['hourly_rate', 'DESC']];
                break;
            case 'TP': // Sort by total_paid descending
                order = [['total_paid', 'DESC']];
                break;
            default:
                order = [['job_date', 'ASC']]; // Default to job_date ascending
        }
        // Construct Sequelize query with filters and include PharmacyGroup join
        const jobs = await Job.findAll({
            where: filters,
            include: [
                {
                    model: Pharmacist,
                    attributes: ['first_name', 'last_name', 'latitude', 'longitude']
                },
                {
                    model: PharmacyGroup,
                    attributes: ['group_name', 'group_code'],
                    where: groupCode ? {group_code: groupCode} : {}, // Apply groupCode filter if provided
                    required: !!groupCode // Only join PharmacyGroup if groupCode filter exists
                },
                {
                    model: PharmacyBranch,
                    attributes: ['branch_name', 'address_1', 'address_2', 'postal_code', 'latitude', 'longitude']
                }
            ],
            order: order,
        });

        // Calculate distance and append to each job
        const jobsWithDistance = jobs.map(job => {
            const distance = calculateDistance(
                    fromLat,
                    fromLng,
                    job.PharmacyBranch.latitude,
                    job.PharmacyBranch.longitude
                    );

            return {
                job_id: job.job_id,
                job_ref: job.job_ref,
                description: job.description,
                job_date: job.job_date,
                job_start_time: job.job_start_time,
                job_end_time: job.job_end_time,
                hourly_rate: job.hourly_rate,
                total_work_hour: job.total_work_hour,
                total_paid: job.total_paid,
                lunch_arrangement: job.lunch_arrangement,
                parking_option: job.parking_option,
                rate_per_mile: job.rate_per_mile,
                status_code: job.status_code,
                status: job.status,
                deleted: job.deleted,

                // Flattened fields from PharmacyGroup
                group_name: job.PharmacyGroup?.group_name || null,
                group_code: job.PharmacyGroup?.group_code || null,

                // Flattened fields from PharmacyBranch
                branch_name: job.PharmacyBranch?.branch_name || null,

                // Flattened fields from Pharmacist
                pharmacist_first_name: job.Pharmacist?.first_name || null,
                pharmacist_last_name: job.Pharmacist?.last_name || null,
                distance, // Append the distance to the job object
            };
        });

        // Sort by distance if sortingSeq is set to sort by distance
        if (sortingSeq === "DI") {
            jobsWithDistance.sort((a, b) => a.distance - b.distance);
        }


        res.status(200).json(jobsWithDistance);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({message: "Error fetching jobs"});
    }
};


// Create new job
exports.createJob = async (req, res) => {
    try {
        const {job_ref, description, job_date} = req.body;
        const newJob = await Job.create({job_ref, description, job_date});
        res.status(201).json(newJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
};

// Update job with last-modified check
exports.updateJob = async (req, res) => {
    const {id} = req.params;
    const {job_ref, description, job_date} = req.body;
    const clientLastModified = new Date(req.headers['last-modified']);

    try {
        const job = await Job.findByPk(id);
        if (!job)
            return res.status(404).json({message: 'Job not found'});

        if (clientLastModified < job.lastModified) {
            return res.status(409).json({message: 'Job has been modified by another user'});
        }

        job.job_ref = job_ref;
        job.description = description;
        job.job_date = new Date();
        await job.save();

        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
};

// Delete job
exports.deleteJob = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await Job.destroy({where: {jobId: id}});
        if (result === 0)
            return res.status(404).json({message: 'Job not found'});

        res.json({message: 'Job deleted'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
};

// Get job detail
exports.getJobById = async (req, res) => {
    const {id} = req.params;
    try {
        const job = await Job.findByPk(id);
        if (!job)
            return res.status(404).json({message: 'Job not found'});

        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
}
