var nodemailer = require('nodemailer');

module.exports = {
  sendEmail : function (mail_from,mail_to,mail_subject,mail_body){

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'penta5geeks@gmail.com',
          pass: 'zyhobzpwqeewpglc'
        }
      });
      
      var mailOptions = {
        from: mail_from,
        to: mail_to,
        subject: mail_subject,
        text: mail_body
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
         return 0;
        } else {
          console.log('Email sent: ' + info.response);
          return 1;
        }
      });
}

}