export default {
  host: 'smtp.mailtrap.io', // process.env.MAIL_HOST,
  port: 2525, // process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: '712d9e0c756434', // process.env.MAIL_USER,
    pass: '37d9859c1d8a60', // process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe MeetApp <noreply@meetap.com>',
  },
};
