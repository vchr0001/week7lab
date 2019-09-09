let mongoose = require('mongoose');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let viewpath = __dirname + '/views/';

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('images'));
app.use(express.static('views'));
app.use(express.static('css'));
app.use(bodyParser.urlencoded({
    extended: false,
    useNewUrlParser: true
}));

let url = "mongodb://localhost:27017/week7lab";
let Developer = require('./models/developers');
let Task = require('./models/task');


mongoose.connect(url, function (err) {
    if (err) {
        console.log(err);
    }

    app.get('/newtask', function (req, res) {
        res.sendFile(__dirname + '/views/newtask.html');
    })

    app.post('/newtask', function (req, res) {
        let task = req.body;
        let newTask = new Task({
            _id: mongoose.Types.ObjectId(task.id),
            taskName: task.taskName,
            assignto: task.assignto,
            due: task.due,
            status: task.status.toUpperCase(),
            description: task.description
        })
        newTask.save(function (err) {
            if (err) console.log(err)
            else {
                console.log("saved!");
            };
        });
        res.redirect('/getalltask');
    });
    app.get('/newdeveloper', function (req, res) {
        res.sendFile(__dirname + '/views/newdeveloper.html');
    })
    app.post('/newdeveloper', function (req, res) {
        let developer = req.body;
        let newDeveloper = new Developer({
            _id: mongoose.Types.ObjectId(developer.id),
            name: {
                fname: developer.fname,
                lname: developer.lname
            },
            level: developer.level.toUpperCase(),
            address: {
                state: developer.state,
                suburb: developer.suburb,
                street: developer.street,
                unit: parseInt(developer.unit)
            }
        })
        newDeveloper.save(function (err) {
            if (err) console.log(err)
            else {
                console.log("saved!");
            };
        });
        res.redirect('/getalldeveloper');
    })
    app.get('/deletebyid', function (req, res) {
        res.sendFile(__dirname + '/views/deletetask.html');
    })
    app.post('/deletebyid', function (req, res) {
        let taskID = req.body.id;
        var fileId = mongoose.Types.ObjectId(taskID);
        Task.deleteOne({
            _id: fileId
        }, function (err, doc) {
            console.log('delete success');
        })
        res.redirect('/getalltask'); // redirect the client to list users page
    });

    app.get('/updatetask', function (req, res) {
        res.sendFile(__dirname + '/views/updatetask.html');
    })
    app.post('/updatetask', function (req, res) {
        let taskID = req.body;
        var fileId = mongoose.Types.ObjectId(taskID.id);
        Task.updateOne({
            _id: fileId
        }, {
            $set: {
                'status': taskID.statusnew
            }
        }, function (err, doc) {
            console.log('update success');
        })
        res.redirect('/getalltask'); // redirect the client to list users page
    });

    app.get('/deletecompleted', function (req, res) {
        res.sendFile(__dirname + '/views/deletecompleted.html');
    });

    app.post('/deletecompleted', function (req, res) {
        let userrespond = req.body;
        if (userrespond.respond === "yes") {
            Task.deleteMany({
                'status': 'COMPLETE'
            }, function (err, doc) {
                console.log("all completed task deleted");
            })
            res.redirect('/getalltask'); // redirect the client to list users page
        } else {
            res.redirect('/getalltask');
        }
    });


    app.get('/getalltask', function (req, res) {
        Task.find({}).exec(function (err, data) {
            res.render(viewpath + 'listtask.html', {
                task: data
            });
        });
    })

    app.get('/getalldeveloper', function (req, res) {
        Developer.find({}).exec(function (err, data) {
            res.render(viewpath + 'listdeveloper.html', {
                developer: data
            })
            // console.log(data);
        });
    })

})

app.get('/', function(req,res){
    res.sendFile(viewpath + 'index.html');
})


app.listen(8000);