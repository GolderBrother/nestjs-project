const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/james");
  console.log("Connected!");

//   首先创建 Schema 描述对象的形状，然后根据 Schema 创建 Model，每一个 model 对象存储一个文档的信息，可以单独 CRUD。
  const PersonSchema = new Schema({
    name: String,
    age: Number,
    hobbies: [String],
  });

  const Person = mongoose.model('Person', PersonSchema);

//   const james = new Person();
//   james.name = "james";
//   james.age = 25;
//   await james.save(); // save the document (this is asynchronous)

//   const zhang = new Person();
//   zhang.name = "zhang";
//   zhang.age = 26;
//   zhang.hobbies = ['coding','study'];
//   await zhang.save();

  const queryPersons = await Person.find({
    $and: [
        {
            // age: {
            //     $gte: 25
            // },
            age: {
                $in: [25, 26]
            }
        },
        // {
        //     name: /james/
        // }
    ]
  });
  console.log(queryPersons);
}
main().catch((err) => console.log(err));
