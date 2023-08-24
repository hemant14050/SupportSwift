const {transporter} = require("../config/mail.config");

exports.sendMail = async(email, message) => {
    try {
        const info = await transporter.sendMail({
            from: `Support Swift - ${process.env.MAIL_USER}`,
            to: email,
            subject: "Account created at Support Swift - Ticket Management Tool",
            html: `
            <b>User account is created at Support Swift - Ticket Management Tool</b>
            <p>Login Id: ${email}</p>
            <p>Password: ${message.password}</p>
            `,
        });
        // console.log(info);
    } catch(err) {
        console.log("Error while sending mail: ", err);
    }
}