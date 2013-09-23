var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require('./utils/ip2sw.js');
var config = require('../config.json');
var options = config.mongodb.admin;
mongoose.connect('mongodb://localhost/leadb',options);

var db = mongoose.connection;
mongoose.set('debug', true);


var adminSchema = mongoose.Schema({
  profile: {type: Schema.Types.ObjectId, ref: 'Leo'},
  pseudo: String
});

var logSchema = mongoose.Schema({
  date: {type: Date, default: Date.now},
  user: {type: Schema.Types.ObjectId, ref: 'Admin'},
  operation: String,
  desc: String
});

var machineSchema = mongoose.Schema({
  name: String,
  mac: String,
  ip: String,
  num: Number,
  active: Boolean,
  owner: {type: Schema.Types.ObjectId, ref: 'Leo'}
});

var leoSchema = mongoose.Schema({
  uid: String,
  first_name: String,
  last_name: String,
  email: String,
  room: {type: Schema.Types.ObjectId, ref: 'Home'},
  machines:[machineSchema]
});

var roomSchema = mongoose.Schema({
  name: String,
  sw: String,
  port: String
});

var authSchema = mongoose.Schema({
	room: {type: Schema.Types.ObjectId , ref:'Home'},
	date: { type: Date, default: Date.now },
	mac: String
});




var Room = mongoose.model('Home', roomSchema);
var Auth = mongoose.model('Auth', authSchema);
var Log = mongoose.model('Log', logSchema);
var Machine = mongoose.model('Machine', machineSchema);
var Leo = mongoose.model('Leo', leoSchema);

db.once('open', function(err) {
  if(!err) {
    console.log("Connected to 'test' database");
}
});

db.on('error', console.error.bind(console,'connection error'));

exports.auth = function(req,res) {
  var entry = req.body;
  // on recup ip/idport/mac
  // on recup la chambre associé
  var port = 'Fa0/'+entry.port.slice(3);
  var sw = utils.ip2switch(entry.sw);
  Room.findOne({sw: sw,port:port}, function(err, room) {
    if(room != null) {
      var mac = entry.mac;
      console.log('room : %s',room.name);
      Machine.findOne({mac:mac, active:true}, function(err, machine) {
        if(!err && machine != null) {
         //check if machine has connected in the correct room
         console.log(machine);
         //ftm odd connection are simply accepted
         res.send(200);        
	      }
        else {
	        //update auth if already exists
          Auth.update({room:room,mac:mac}, {date:new Date()},{upsert: true}, function(err, numAffect, raw) {
            if(err) console.log(err);
            res.send(403);
        });
        }
      });
    }
  });
  
  // on check si la machine existe
  // si existe
  //   on check si la machine est bien enregistrée dans cette chambre
  //   si ok
  //     return ok
  //   sinon
  //     log anomalie
  //     return ok
  // sinon
  //   on log la nouvelle machine



}
exports.listAuth = function(req, res) {
  Auth.find().limit(10).populate('room').exec(function(err,auths) { res.send(auths);});
}

exports.findPendingMachine = function(req, res) {
  var roomName = req.query.room;
  Room.findOne({name:roomName}, function(err, room) {
      Auth.find({room:room._id},'mac date').exec(function(err, auths) {
      if(err) {return res.send(400, {'error':err});}
	    if(!auths) return res.send({});
        Leo.findOne({room:room},function(err, leo) {
	        if(leo == null) res.send({});
          var data = {uid: leo.uid, first_name: leo.first_name, leoId: leo._id, last_name: leo.last_name, room: leo.room, machines: auths};
	        res.send(data);
        }); 
      });
  });
}

exports.validatePendingMachine = function(req, res) {
  var authId = req.body._id;
  Auth.findOne({_id:authId}).populate('room','name').exec( function(err, auth) {
    Leo.findOne({room:auth.room}, function(err, leo) {
      if(err) {return res.send(400,{'err':err});}
      if(!leo) {return res.send(400,{'err':'empty room'});}
        Machine.find({owner:leo}, function(err, machines) {
          var num = machines.length;
          if(num > 15) { return res.send({'error':'too many machines'});}
          var ext = (num == 0) ? '': '-' + (num + 1);
          var name = 'l' + auth.room.name + ext;
          var ip = genIP(auth.room.name, num+1);
          var newMachine = new Machine({mac:auth.mac,name:name,owner:leo,ip:ip,active:true});
          newMachine.save();
          auth.remove();
          res.send({'message': 'success'});
        }); 
    });
  });
}

exports.searchLeo = function(req, res) {
  var name = req.query.name;
  Leo.find({uid:{$regex: name, $options: 'i'}, room: {$exists:true}},'uid last_name first_name room email').populate('room','name').limit(20).sort('uid').exec(function(err,results) {
  	res.send(results);
  });
}

exports.findLeoByUid = function(req, res) {
  var uid = req.query.uid;
  Leo.findOne({uid:uid, room: {$exists:false}},'uid last_name first_name room email').populate('room','name').exec(function(err, leo) {
    res.send(leo);
  });
}
exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving leo: ' + id);
  Leo.findById(id).populate('room','name').exec( function (err, leo) {
    Machine.find({owner:id}, function(err, machines) {
      leo.machines = machines;
      !err ? res.send(leo) : console.log(err);
    });
  });
};

exports.addLeo = function(req, res) {
	var leo = req.body;
	Leo.create(leo, function(err, leo) {
		err ? res.send(400, {'error':'when adding leo'}) : res.send(leo);
	});
}
exports.deleteLeo = function(req, res) {
	var id = req.params.id;
	console.log('Deleting Leo '+ id );
	Leo.findByIdAndRemove(id, function(err) {
		err ? res.send(400, {'error':'when deleting leo'}) : res.send(req.body);
	});
}

exports.searchMachine = function(req, res) {
  Machine.find().populate('owner').exec(function(err, machines) {
    return res.send(machines);
  });
}

exports.addMachine = function(req, res) {
var leoId = req.params.id;
var mac = req.body.mac;
//validate mac
mac = mac.replace(/[- ]/g,":");
if(!/^([0-9a-f]{2}[:-]){5}([0-9a-f]{2})$/.test(mac)) {return res.send(400,{"error":"invalid mac"});}

Leo.findById(leoId).populate('room').exec( function(err, leo) {
	if(!leo || !leo.room) {return res.send(400,{"error":"invalid leo"});}
	if(err) {return res.send(500, {"error":err});}
        Machine.find({owner:leo}, function(err, machines) {
          var num = machines.length;
          if(num > 15) { return res.send({'error':'too many machines'});}
          var ext = (num == 0) ? '': '-' + (num + 1);
          var name = 'l' + leo.room.name + ext;
          var ip = genIP(leo.room.name, num+1);
          var newMachine = new Machine({mac:mac,name:name,owner:leo,ip:ip,active:true});
          newMachine.save();
	  return res.send(newMachine);
});
});
}
// exports.deleteMachine = function(req, res) {
//   var idMachine = req.params.idMachine;
//   Machine.findById(id, function(err, machine) {
//     if(err) {return res.send({'err':err});}
//     if(!machine) {return res.send({'err':'invalid machine'});}
//     machine.remove();
//     res.send({'message':'success'});
//   });
// }


// move existing leo in a room (move out existing leo in room at the same time)
exports.moveLeo = function(req, res) {
  var roomName = req.body.room;
  var leoId = req.body._id;

  Leo.findById(leoId, function(err, newLeo) {
    if(err) { return res.send(400, {'error':err});}
    if(!newLeo) {return res.send(400, {'error':'cannot find leo'});}

    Room.findOne({name:roomName}, function(err, room) {
      if(err) {return res.send(400, {'error':err});}
      if(!room) {return res.send({'error':'invalid room'});}
      //find existing leo in room and move it outside
      Leo.findOneAndUpdate({room:room}, {$unset:{room:''}}, function(err, exLeo) {
        console.log(exLeo);
        //clean all the machines
        Machine.update({owner:exLeo},{$set:{active: false}},{multi: true}).exec();
        //finally move leo in room
        newLeo.update({$set:{room:room}}, function(err, leo) {
          return res.send({'message':'succesfully moved ' + newLeo.uid + ' in ' + roomName});  
        });
        
      });
    });

  });

}

//dirty gen IP
//careful with number value ...
function genIP(roomNumber,number) {
var flat = roomNumber.charCodeAt(0) - 96;
var level = roomNumber[1];
var room = (roomNumber[roomNumber.length -1] == 'b') ? parseInt(roomNumber.substr(2,2))+50:parseInt(roomNumber.substr(2,2));
var room = parseInt(room);
var number2 = Math.ceil((number-1/2)/4)-1;
var number = number -  4 * number2;
return ('172.30.'+(128+16*flat+4*level+(number-1))+'.'+(room+100*number2));
}
