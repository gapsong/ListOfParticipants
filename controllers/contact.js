var nodemailer = require('nodemailer');
var knex = require('knex')({client: 'pg', connection: process.env.DATABASE_URL});
var transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD
  }
});

/**
 * GET /contact
 */
exports.contactGet = function(req, res) {
  res.render('contact', {title: 'Contact'});
};

/**
 * POST /contact
 */
exports.contactPost = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({remove_dots: false});

  console.log(req.body);

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var mailOptions = {
    from: req.body.name + ' ' + '<' + req.body.email + '>',
    to: 'your@email.com',
    subject: '✔ Contact Form | Mega Boilerplate',
    text: req.body.message
  };

  // transporter.sendMail(mailOptions, function(err) {
  //   res.send({msg: 'Thank you! Your feedback has been submitted.'});
  // });
  knex('emails').insert({email: req.body.email, name: req.body.name, wantnewsletter: req.body.wantNewsletter}).then(() => {
      res.send({msg: 'Thank you!'});
  });
};
//
// exports.addSubscriber = function(req, res) {
//   return knex.select('*').from('emails').then(function(rows) {
//     return res.send(rows);
//   });
// };

exports.addSubscriber = function(req, res) {
  console.log("req body",req.body)
  knex('emails').insert({email: req.body.email, name: req.body.name, newsletterToggle: req.body.newsletterToggle}).then(() => {
    knex('isMentor').insert({user_id: req.user.github.id, project_id: req.body.project_id}).then(() => {
      res.json({success: true});
    });
  });
}
