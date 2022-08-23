const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://thiseas:${password}@cluster0.ndply0n.mongodb.net/noteApp?retryWrites=true&w=majority`;

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");

    const note = new Note({
      content: "and the waves?",
      date: new Date(),
      important: false,
    });

    return note.save();

    //  Note.find({}).then((result) => {
    //    result.forEach((note) => {
    //      console.log(note);
    //    });
    //    mongoose.connection.close();
    //  });
  })
  .then(() => {
    //  console.log("note saved!");
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));
