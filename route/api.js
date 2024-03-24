const express = require('express');
const axios = require("axios");
const moment = require("moment-timezone");
const translate = require("@vitalets/google-translate-api");
const {
	igApi,
	getCookie
} = require("insta-fetcher");
const { ytPlay, ytMp3, ytMp4 } = require("../lib/youtube");
const { readFileTxt, readFileJson } = require('../lib/function');
const router = express.Router();
/*Respon nyet*/
const creator = 'David XD'
const no_text_message = {
	creator: creator,
	status: 404,
	message: 'TEXT not found, please enter TEXT'
}
const no_link_message = {
	creator: creator,
	status: 404,
	message: 'URL not found, please enter URL'
};
const no_cookie_message = {
	creator: creator,
	status: 404,
	message: 'COOKIE not found, please enter COOKIE'
}
const Error_message = {
	creator: creator,
	status: 404,
	message: 'Sorry, an internal error occurred on the server'
}
//Downloaders
router.post('/instagram', async (req, res) => {
	if (!req.body.url) return res.status(400).json(no_link_message);
	if (!req.body.cookie) return res.status(400).json(no_cookie_message)
	let ig = new igApi(req.body.cookie)
	ig.fetchPost(req.body.url)
		.then((v) => {
			res.status(200).json({
				creator: creator,
				...v
			});
		})
		.catch((Error) => {
			console.log(Error);
			res.status(500).json({
				...Error_message,
				Error: Error.toString()
			});
		});
});
router.post('/instagram/getcookie', async (req, res) => {
	if (!req.body.username) return res.status(400).json({
		creator: creator,
		message: 'input username'
	});
	if (!req.body.password) return res.status(400).json({
		creator: creator,
		message: 'input password'
	});
	try {
		const session_id = await getCookie(req.body.username, req.body.password);
		res.json({
			creator: creator,
			cookie: session_id
		})
	} catch (Error) {
		console.log(Error)
		res.status(400).json({
			creator: creator,
			message: Error
		})
	}
});

//Yt Play
router.get('/youtube/ytplay', async (req, res) => {
    const query = req.body.query;
	if (!query) return res.status(400).json({
		creator: creator,
		status: 400,
		message: 'input query'
	});
	ytPlay(query).then(result => {
        res.status(200).json({
            creator: creator,
            status: 200,
            result: result
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            creator: creator,
            status: 500,
            message: 'Internal Server Error'
        })
    });
});
//Yt Mp3
router.get('/youtube/ytmp3', async (req, res) => {
    const link = req.body.query;
	if (!link) return res.status(400).json({
		creator: creator,
		status: 400,
		message: 'Input YouTube URL'
	});
	ytMp3(link).then(result => {
        res.status(200).json({
            creator: creator,
            status: 200,
            result: result
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            creator: creator,
            status: 500,
            message: 'Internal Server Error'
        })
    });
});
//Yt Mp4
router.get('/youtube/ytmp4', async (req, res) => {
    const link = req.body.query;
	if (!link) return res.status(400).json({
		creator: creator,
		status: 400,
		message: 'Input YouTube URL'
	});
	ytMp4(link).then(result => {
        res.status(200).json({
            creator: creator,
            status: 200,
            result: result
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            creator: creator,
            status: 500,
            message: 'Internal Server Error'
        })
    });
});

//Random Text
router.get('/random/quotes', async (req, res) => {
try {
    let result = await readFileJson('../lib/data/quotes.json')
    let hasil = await translate(result.quotes, { to: 'en' });
        res.status(200).json({
            creator: creator,
            status: 200,
            result: {
                indonesia: {
                    quotes: result.quotes,
                    author: result.author
                },
                english: {
                    quotes: hasil,
                    author: result.author
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            creator: creator,
            status: 500, 
            message: 'Internal Server Error'
        });
    };
});

router.get('/random/fakta', async (req, res) => {
try {
    let result = await readFileTxt('../lib/data/fakta.txt')
    let hasil = await translate(result, { to: 'en' });
        res.status(200).json({
            creator: creator,
            status: 200,
            result: {
                indonesia: result,
                english: hasil
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            creator: creator,
            status: 500, 
            message: 'Internal Server Error'
        });
    };
});

router.get('/random/bijak', async (req, res) => {
try {
    let result = await readFileTxt('../lib/data/bijak.txt')
    let hasil = await translate(result, { to: 'en' });
        res.status(200).json({
            creator: creator,
            status: 200,
            result: {
                indonesia: result,
                english: hasil
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            creator: creator,
            status: 500, 
            message: 'Internal Server Error'
        });
    };
});

router.get('/random/penyegartimeline', async (req, res) => {
    readFileTxt('../lib/data/ptl.txt').then(result => {
        res.status(200).json({
            creator: creator,
            status: 200,
            result: result
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            creator: creator,
            status: 500, 
            message: 'Internal Server Error'
        });
    });
});

router.get('/random/motivasi', async (req, res) => {
try {
    let result = await readFileTxt('../lib/data/motivasi.txt')
    let hasil = await translate(result.replace(/"/g, ''), { to: 'en' });
        res.status(200).json({
            creator: creator,
            status: 200,
            result: {
                indonesia: result.replace(/"/g, ''),
                english: hasil
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            creator: creator,
            status: 500, 
            message: 'Internal Server Error'
        });
    };
});

//Lahelu/Meme
router.get('/lahelu-meme/random', async (req, res) => {
  try {
    const { data } = await axios.get(`https://lahelu.com/api/post/get-posts?feed=${Math.floor(Math.random() * 3)}&page=${Math.floor(Math.random() * 100)}`);
    const Media = data.postInfos;
    const Info = Media[Math.floor(Math.random() * Media.length)];
    if (Info.media === 1) {
        res.status(200).json({
            creator: "David XD & Putu OFFC",
            status: 200,
            result: {
                videoinfo: {
                    title: Info.title,
                    upvotes: Info.totalUpvotes,
                    downvotes: Info.totalDownvotes,
                    comment: Info.totalComments,
                    created: moment(Info.createTime).format('YYYY-MM-DD'),
                    mediaType: "Video",
                    media: "https://cache.lahelu.com/" + Info.media
                },
                infouser: {
                    username: Info.userUsername,
                    url: "https://cache.lahelu.com/" + Info.userAvatar
                }
            }
        });
    } else if (Info.media === 0) {
        res.status(200).json({
            creator: "David XD & Putu OFFC",
            status: 200,
            result: {
                videoinfo: {
                    title: Info.title,
                    upvotes: Info.totalUpvotes,
                    downvotes: Info.totalDownvotes,
                    comment: Info.totalComments,
                    created: moment(Info.createTime).format('YYYY-MM-DD'),
                    mediaType: "Photo",
                    media: "https://cache.lahelu.com/" + Info.media
                },
                infouser: {
                    username: Info.userUsername,
                    url: "https://cache.lahelu.com/" + Info.userAvatar
                }
            }
        });
    }
  } catch (error) {
    res.status(500).json({
        creator: "David XD & Putu OFFC",
        status: 500,
        message: "Internal Server Error"
    });
  }
});

router.get('/lahelu-meme/search', async (req, res) => {
  try {
    const query = req.query.q;
    const { data } = await axios.get(`https://lahelu.com/api/post/get-search?query=${query}&page=${Math.floor(Math.random() * 13)}`);
    const Media = data.postInfos;
    const Info = Media[Math.floor(Math.random() * Media.length)];
    if (Info.media === 1) {
        res.status(200).json({
            creator: "David XD & Putu OFFC",
            status: 200,
            result: {
                videoinfo: {
                    title: Info.title,
                    upvotes: Info.totalUpvotes,
                    downvotes: Info.totalDownvotes,
                    comment: Info.totalComments,
                    created: moment(Info.createTime).format('YYYY-MM-DD'),
                    mediaType: "Video",
                    media: "https://cache.lahelu.com/" + Info.media
                },
                infouser: {
                    username: Info.userUsername,
                    url: "https://cache.lahelu.com/" + Info.userAvatar
                }
            }
        });
    } else if (Info.media === 0) {
        res.status(200).json({
            creator: "David XD & Putu OFFC",
            status: 200,
            result: {
                videoinfo: {
                    title: Info.title,
                    upvotes: Info.totalUpvotes,
                    downvotes: Info.totalDownvotes,
                    comment: Info.totalComments,
                    created: moment(Info.createTime).format('YYYY-MM-DD'),
                    mediaType: "Photo",
                    media: "https://cache.lahelu.com/" + Info.media
                },
                infouser: {
                    username: Info.userUsername,
                    url: "https://cache.lahelu.com/" + Info.userAvatar
                }
            }
        });
    }
  } catch (error) {
    res.status(500).json({
        creator: "David XD & Putu OFFC",
        status: 500,
        message: "Internal Server Error"
    });
  }
});

module.exports = router;
