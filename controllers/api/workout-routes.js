const router = require("express").Router();
const { Workout } = require("../../models");

//Create the workout.
router.post("/workouts", async (req, res) => {
  try {
    const workoutData = await Workout.create({});
    console.log(workoutData);
    res.status(200).json(workoutData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/workouts/:id", async (req, res) => {
  try {
    console.log("Workout ID" + req.params.id)
    console.log("Exercises" + req.body)
    const workoutData = await Workout.findByIdAndUpdate(
      req.params.id,
      { $push: { exercises: req.body } },
      { new: true }
    );
    console.log(workoutData);
    res.status(200).json(workoutData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/workouts", async (req, res) => {
  try{
      //this compiles new data based on information already in the database to get the total duration of the exercises
    const workoutData = await Workout.aggregate([
    {
        //add field of total duration.
      $addFields: {
        totalDuration: {
            //sum of the exercise durations inside the exercise array.
          $sum: "$exercises.duration",
        },
      },
    },
  ])
console.log()
  res.status(200).json(workoutData)
} catch(err) {
    res.status(500).json(err)
}
});

router.get("/workouts/range", async (req,res) => {
    try{
        const workoutData = await Workout.aggregate([
        {
          $addFields: {
            totalDuration: {
              $sum: "$exercises.duration",
            },
          },
        },
        //this sorts 7 of the workouts by id in descending order aka the last week.
      ]).sort({_id: -1}).limit(7)

      res.status(200).json(workoutData)
    } catch(err) {
        res.status(500).json(err)
    }
    });



router.delete("/workouts", async (req,res) => {
    try {
    const workoutData = await Workout.findByIdAndDelete(req.body);
    res.status(200).json(true)
    console.log(workoutData);
} catch(err) {
    res.status(500).json(err)
}
});

module.exports = router;
