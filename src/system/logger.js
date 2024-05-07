const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const chalk = require('chalk');
const ora = require('ora');

class Logger {
  constructor(client) {
    this.logDir = 'logs';
    this.errorLogFile = path.join(this.logDir, 'error.json');
    this.warnLogFile = path.join(this.logDir, 'warn.json');
    this.infoLogFile = path.join(this.logDir, 'info.json');
    this.debugLogFile = path.join(this.logDir, 'debug.json');
    this.maxLogFileSize = 1024 * 1024 * 5; // 5 MB

    // Create the logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }

    // Create the log files if they don't exist
    this.createLogFileIfNotExists(this.errorLogFile);
    this.createLogFileIfNotExists(this.warnLogFile);
    this.createLogFileIfNotExists(this.infoLogFile);
    this.createLogFileIfNotExists(this.debugLogFile);

    this.client = client;
  }

  getEmojiForLevel(level) {
    return {
      error: chalk.red.bold('❌'),
      warn: chalk.yellow.bold('⚠️'),
      info: chalk.green.bold('✨'),
      debug: chalk.blue.bold('🔍'),
    }[level];
  }

  getColorForLevel(level) {
    return {
      error: chalk.bgRed.white,
      warn: chalk.bgYellow.black,
      info: chalk.bgGreen.white,
      debug: chalk.bgBlue.white,
    }[level];
  }

  info(message, shard) {
    this.writeLog('info', message, shard);
  }

  error(message, shard) {
    this.writeLog('error', message, shard);
  }

  warn(message, shard) {
    this.writeLog('warn', message, shard);
  }

  debug(message, shard) {
    this.writeLog('debug', message, shard);
  }

  writeLog(level, message, shard) {
    const timestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm');
    const levelEmoji = this.getEmojiForLevel(level);
    const levelColor = this.getColorForLevel(level);
    const formattedMessage = `${levelColor(`[${timestamp}] [${levelEmoji} ${level.toUpperCase()}]: ${message}`)}`;
    console.log('<------------')
    console.log(formattedMessage);
    console.log('------------->')

    const logEntry = {
      timestamp,
      level,
      message,
      shard,
    };

    this.appendToLogFile(level, logEntry);
    this.rotateLogFile(level);
  }

  appendToLogFile(level, logEntry) {
    let logFile;
    switch (level) {
      case 'error':
        logFile = this.errorLogFile;
        break;
      case 'warn':
        logFile = this.warnLogFile;
        break;
      case 'info':
        logFile = this.infoLogFile;
        break;
      case 'debug':
        logFile = this.debugLogFile;
        break;
      default:
        throw new Error(`Invalid log level: ${level}`);
    }

    const logData = this.readLogFile(logFile);
    logData.push(logEntry);
    this.writeLogFile(logFile, logData);
  }

  rotateLogFile(level) {
    let logFile;
    switch (level) {
      case 'error':
        logFile = this.errorLogFile;
        break;
      case 'warn':
        logFile = this.warnLogFile;
        break;
      case 'info':
        logFile = this.infoLogFile;
        break;
      case 'debug':
        logFile = this.debugLogFile;
        break;
      default:
        throw new Error(`Invalid log level: ${level}`);
    }

    const logFileSize = this.getLogFileSize(logFile);
    if (logFileSize >= this.maxLogFileSize) {
      const spinner = ora('🤖 Rotating log file...').start();
      const backupLogFile = path.join(this.logDir, `${level}_logs_${Date.now()}.json`);
      fs.renameSync(logFile, backupLogFile);
      this.createLogFileIfNotExists(logFile);
      spinner.succeed(`🤖 Rotated ${level} log file: ${backupLogFile}`);
    }
  }

  readLogFile(logFile) {
    try {
      return JSON.parse(fs.readFileSync(logFile, 'utf8'));
    } catch (err) {
      if (err.code === 'ENOENT') {
        return [];
      } else {
        throw err;
      }
    }
  }

  writeLogFile(logFile, logData) {
    fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
  }

  getLogFileSize(logFile) {
    try {
      return fs.statSync(logFile).size;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return 0;
      } else {
        throw err;
      }
    }
  }

  createLogFileIfNotExists(logFile) {
    if (!fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, '[]');
    }
  }
}

module.exports = Logger;