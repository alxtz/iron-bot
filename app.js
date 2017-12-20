var moment = require('moment-timezone');
var express = require('express');
var request = require('request');

var app = express();

const PORT = 4390;

app.listen(PORT, function () {
  console.log("Example app listening on port " + PORT);
});

app.get('/', function(req, res) {

  res.status(200).send('reading api ...')

  const POST_URL = req.query.response_url
  console.log('POST_URL', POST_URL)

  request({
    url: 'http://ironmans.goodideas-studio.com/',
    method: 'GET',
  }, function (error, response, body) {
    let str, json
    if (error) { console.log(error); } else {
      str = response.body
      json = JSON.parse(str)
    }

    const TODAY = getToday()

    const attachments = []
    json.forEach(person => {
      let postTitle
      const hasTodayPost = person.postList.find(post => {
        if(post.date === TODAY['yyyy-mm-dd']) {
          postTitle = post.title
        }
        return post.date === TODAY['yyyy-mm-dd']
      })
      if(hasTodayPost) {
        const LENGTH = 15
        let displayTitle = postTitle.substring(0, LENGTH)
        attachments.push({
         'text': `${person.name}: 『${displayTitle}』`
        })
      }
    })

    const text = {
      "response_type": "in_channel",
      "text": `今天 ( ${TODAY.month} / ${TODAY.day} ) 已發文`,
      "attachments": attachments
    }

    request({
      url: POST_URL,
      method: 'POST',
      json: text
    }, function (error, response, body) {
    })
  })
});

function getToday() {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  console.log('Today is', year + "-" + month + "-" + day)
  return {
    'year': year,
    'month': month,
    'day': day,
    'yyyy-mm-dd': `${year}-${month}-${day}`
  }
}

app.get('/blame', function(req, res) {

  res.status(200).send('reading api ...')

  const POST_URL = req.query.response_url
  console.log('POST_URL', POST_URL)

  request({
    url: 'http://ironmans.goodideas-studio.com/',
    method: 'GET',
  }, function (error, response, body) {
    let str, json
    if (error) { console.log(error); } else {
      str = response.body
      json = JSON.parse(str)
    }

    const TODAY = getToday()

    const notPosted = []
    const notPostedId = []
    json.forEach(person => {
      let postTitle
      const hasTodayPost = person.postList.find(post => {
        if(post.date === TODAY['yyyy-mm-dd']) {
          postTitle = post.title
        }
        return post.date === TODAY['yyyy-mm-dd']
      })
      if(hasTodayPost === undefined) {
        const CHAR = '('
        const SHORT_NAME = person.name.substring(0, person.name.indexOf(CHAR))
        notPosted.push(` <@${SHORT_NAME.slice(0, -1)}> `)

        var match = person.name.match(/\((.*?)\)/);

        if (match) {
          console.log(match[1])
          notPostedId.push(`<@${match[1]}>`)
        }
      }
    })

    console.log(`今天${notPosted}還沒發文`)

    const text = {
      "response_type": "in_channel",
      "text": `${notPostedId} 今天 ( ${TODAY.month} / ${TODAY.day} ) 還沒發文哦`,
    }

    request({
      url: POST_URL,
      method: 'POST',
      json: text
    }, function (error, response, body) {
    })
  })
});

function getToday() {
  console.log(moment().tz('Asia/Taipei').date())
  var dateObj = new Date()
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  month = moment().tz('Asia/Taipei').get('month') + 1
  day = moment().tz('Asia/Taipei').get('date')
  year = moment().tz('Asia/Taipei').get('year')

  console.log('Today is', year + "-" + month + "-" + day)
  return {
    'year': year,
    'month': month,
    'day': day,
    'yyyy-mm-dd': `${year}-${month}-${day}`
  }
}
