
function test(to,subject,attachments){
    const nodemailer = require('nodemailer');
    
    let mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'priyajeetc@gmail.com',
          pass: 'alok@2570'
      }
    });
    let mailDetails = {
      from: 'priyajeetc@gmail.com',
      to: to,
      subject: subject,
      html: "<h3>Your Note has been sent on "+Date() +"</h3>",
      attachments: [{
        path : "uploads/"+attachments,

      }]
    };
    mailTransporter.sendMail(mailDetails, function(err, data) {
      if(err) {
          console.log('Error Occurs');
      } else {
          console.log('Email sent successfully');
      }
    });

}

module.exports = test