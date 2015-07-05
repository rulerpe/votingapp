var jwt		= require('jsonwebtoken'),
	User	= require('../models/user'),
	Votes	= require('../models/vots.js'),	
	config	= require('../../config'),
	superSecret = config.secret;

module.exports = function(app, express){


	var apiRouter = express.Router();

	// -----------------------------------create user----------------------------------
	apiRouter.route('/users')
		.post(function(req,res){
			var user = new User();

			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;

			user.save(function(err){
				if(err){
					if(err.code == 11000)
						return res.json({ success: false, message: 'username already exists.'});
					else
						return res.send(err);
				}
				res.json({message: 'user created!'});
			})
		})



	apiRouter.post('/authenticate', function(req,res){
		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err, user){
			if(err) throw err;

			if(!user){
				res.json({
					success: false,
					message: 'Authentication failed. user not found.'
				});
			}else if(user){
				var vailidPassword = user.comparePassword(req.body.password);
				if(!vailidPassword){
					res.json({
						success: false,
						message: 'Authentication failed. Wrong password.'
					});
				}else {
					var token = jwt.sign({
						name: user.name,
						username: user.username,
						user_id: user._id
					}, superSecret,{
						expiresInMinutes: 1440
					});

					res.json({
						success: true,
						message: 'enjoy your token',
						token: token
					})
				}
			}
		})
	})

	// -----------------------------view vates-------------------------------------------------------------
	apiRouter.route('/votes/:vote_id')
		.get(function(req,res){
			Votes.findById(req.params.vote_id, function(err, vote){
				if(err) res.send(err);

				res.json(vote)
			})
		})
		


	apiRouter.use(function(req, res, next){
		var token = req.body.token ||  req.param('token') || req.headers['x-access-token'];

		if(token){
			jwt.verify(token, superSecret, function(err,decoded){
				if(err){
					return res.status(403).send({
						success: false,
						message: 'Failed to authenticate token.'
					});
				}else {
					req.decoded = decoded;
					next();
				};
			});
		} else {
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			})
		}

		console.log('someone just came');
		
	});

	// ----------------------------------create vote-------------------------------------------
	apiRouter.route('/votes')
		.post(function(req,res){
			var votes = new Votes();
			votes.name = req.body.name;
			votes.user = req.decoded.user_id;
			var optionArr = req.body.options.split(",").slice(0,-1);
			optionArr = optionArr.map(function(name){
				var newObj = {};
				newObj.name = name;
				newObj.count = 0;
				return newObj;
			});
			
			votes.options = optionArr;
			console.log(votes);
		
			votes.save(function(err){
				if(err){
					if(err.code == 11000)
						res.json({ success: false, message: 'Vote name already exists'});
					else
						res.send(err);
				}else{
				User.findByIdAndUpdate( req.decoded.user_id, { $push:{ vots: {id: String(votes._id)}}},function(err){
					if(err) res.send(err);
					else res.json({message: "Vote created"});
				});
				}
			});		
		})
	// ----------------------------------------view all vote-----------------------------------
		.get(function(req, res){
			Votes.find(function(err, votes){
				if(err) res.send(err);

				res.json(votes);
			});
		})
		.delete(function(req,res){
			Votes.remove({}, function(err,votes){
				if(err) return res.send(err);
				res.json({message: 'all deleted'})
			})
		});
	//------------------------------------delete vote ---------------------------------
	apiRouter.route('/votes/:vote_id')
		.delete(function(req,res){
			User.findByIdAndUpdate(req.decoded.user_id, { $pull:{ vots: {id: req.params.vote_id}}}, function(err, data){
	  			if(err) 
	  				res.send(err)
	  			else{
	  				Votes.findById(req.params.vote_id,function(err,vote){
	  					if(req.decoded.user_id == vote.user){
	  						Votes.remove({_id: req.params.vote_id }, function(err,votes){
								if(err) return res.send(err);
								res.json({message: req.decoded.user_id})
							})
	  					}else
	  						res.json({message: "can not delete"})
	  				})	
	  			}
			});
			
		})
	// -------------------------------------edit vote -------------------------------
		.put(function(req, res){
			Votes.findById(req.params.vote_id,function(err,vote){
				if(req.decoded.user_id == vote.user){
					var optionArr = req.body.options.split(",").slice(0,-1);
					if(vote.name != req.body.name){
						vote.name = req.body.name;
					}
					console.log(optionArr)
					vote.options = vote.options.filter(function(orgVal){
						var keep = optionArr.some(function(updateVal){
							return orgVal.name == updateVal
						})
						return keep;
					});
					optionArr.forEach(function(updateVal){
						var keep = vote.options.some(function(orgVal){
							return orgVal.name == updateVal
						})
						if(!keep){
							vote.options.push({name: updateVal, count: 0})
						}
					})
					vote.save(function(err){
						if(err) res.send(err);
						res.json({message: "Vote updated"});
					})
					
				}else
					res.json({message: "can not add"})
			})		
		});

	// --------------------------------- vote ------------------------------------------
		

	// -----------------------------------edit poll -----------------------------------

	apiRouter.route('/pick/:vote_id')
		.put(function(req, res){
			Votes.findById(req.params.vote_id, function(err, vote){
				vote.options =vote.options.map(function(opt){
					if(opt.name == req.body.choice){ opt.count = opt.count+1; }
					return opt;
				});
		//		console.log(vote);
				vote.markModified('options');
				vote.save(function(err){ 
					if(err) res.send(err); 
					console.log(vote);
					res.json({message: "Voted"});
				});
				
			})	
		});
	// -------------------------------- remove option ------------------------------------

	apiRouter.route('/votes/remove/:vote_id')
	.put(function(req, res){
		Votes.findById(req.params.vote_id,function(err,vote){
			if(req.decoded.user_id == vote.user){
				Votes.findByIdAndUpdate(req.params.vote_id, {$pull:{options: {name: req.body.option}}},function(err, vote){
					res.json({message: "option removed"});
				})
			}else
				res.json({message: "can not remove"})
		})		
	});

	apiRouter.get('/', function(req, res){
		res.json({ message: 'hooray1 welcome to our api!'});
	})

	apiRouter.route('/users')
		.post(function(req,res){
			var user = new User();

			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;

			user.save(function(err){
				if(err){
					if(err.code == 11000)
						return res.json({ success: false, message: 'username already exists.'});
					else
						return res.send(err);
				}
				res.json({message: 'user created!'});
			})
		})
		.get(function(req, res){
			User.find(function(err, users){
				if(err) res.send(err);

				res.json(users);
			});
		})
		.delete(function(req, res){
			User.remove({}, function(err, user){
				if(err) return res.send(err);
				res.json({message: 'Successfully deleted'});
			})
		})

	apiRouter.route('/users/:user_id')
		.get(function(req, res){
			User.findById(req.params.user_id,  function(err, user) {
				if(err) res.send(err);

				res.json(user);
			});
		})
		.put(function(req,res){
			User.findById(req.params.user_id, function(err, user){
				if(err) res.send(err);

				if(req.body.name) user.name = req.body.name;
				if(req.body.username) user.username = req.body.username;
				if(req.body.password) user.password = req.body.password;
				user.save(function(err){
					if(err) res.send(err);
				});
				res.json({ message: 'user updated!'});
			})
		})
		.delete(function(req, res){
			User.remove(req.params.user_id, function(err, user){
				if(err) return res.send(err);
				res.json({message: 'Successfully deleted'});
			})
		});

	apiRouter.route('/myvotes')
		.get(function(req,res){
			Votes.find({}, function(err, votes){
				var voteMap = votes.filter(function(vote){
								return vote.user == req.decoded.user_id;
							});
				var data = {name:req.decoded.name, data: voteMap};
				res.json(data);
			})
			
		})

	apiRouter.get('/me', function(req,res){
		res.send(req.decoded);
	})

	return apiRouter;

}