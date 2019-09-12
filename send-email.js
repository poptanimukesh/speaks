'use strict';
const nodemailer = require('nodemailer');
var nodeoutlook = require('nodejs-nodemailer-outlook')

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing

var EmailModel = function() {

}

EmailModel.prototype.sendEmail = function(to, subjectLine, body) {
    console.log(to);

    nodeoutlook.sendEmail({
        auth: {
            user: "pharmdsp@usc.edu",
            pass: "scholarlyproject"
        }, from: 'pharmdsp@usc.edu',
        to: to,
        subject: subjectLine,
        html: body,
        // text: 'This is text version!',
        
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }
    );

    // nodemailer.createTestAccount((err, account) => {
    //     // create reusable transporter object using the default SMTP transport
    //     let transporter = nodemailer.createTransport({
    //         host: 'smtp.office365.com;smtp.gmail.com;smtp2.example.com',
    //         port: 587,
    //         secure: false, // true for 465, false for other ports
    //         auth: {
    //             user: 'pharmdsp@usc.edu',
    //             pass: 'scholarlyproject'
    //         }
    //     });

    //     // setup email data with unicode symbols
    //     let mailOptions = {
    //         from: '"Mukesh Poptani " <poptanimukesh@gmail.com>', // sender address
    //         to: to, // list of receivers
    //         subject: subjectLine, // Subject line
    //         //text: 'Hello world', // plain text body
    //         html: body // html body
    //     };

    //     // send mail with defined transport object
    //     transporter.sendMail(mailOptions, (error, info) => {
    //         if (error) {
    //             return console.log(error);
    //         }
    //         console.log('Message sent: %s', info.messageId);
    //         // Preview only available when sending through an Ethereal account
    //         //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    //         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    //         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    //     });
    // });
    return true;
}

module.exports = EmailModel;