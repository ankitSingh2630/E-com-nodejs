// const {createLogger, transports, format} = require("winston")

// // logging function

// const customerLogger = createLogger({
//     transports :[
//         new transports.File({
//             filename:"customer.log",
//             level:"info",
//             format: format.combine(format.timestamp(), format.json())
//         }),
//         new transports.File({
//             filename : "customer-error.log",
//             level : "error",
//             format: format.combine(format.timestamp(), format.json())
//         })
//     ]
// })

// module.exports = {customerLogger};

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${meta.label}] ${level}: ${message} ${JSON.stringify(meta)}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/app.log' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ]
});

module.exports = logger;
