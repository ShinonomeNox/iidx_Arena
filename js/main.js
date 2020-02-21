jQuery(function($){

    const diffArr = ['begginer', 'normal', 'hyper', 'another', 'legen'];
    const rankArr = ['C5', 'C4', 'C3', 'C2', 'C1', 'B5', 'B4', 'B3', 'B2', 'B1', 'A5', 'A4', 'A3', 'A2', 'A1'];
    const optionArr = ['default', 'mirror', 'random', 'r-random', 's-random'];
    const scoreRankArr = ['MAX-', 'AAA', 'AA', 'A', 'B以下'];
    let inputData = {};
    const getNowDate = function(){
        let now = new Date();
        let Year = "" +now.getFullYear();
        let Month = "00" + (now.getMonth()+1);
        let day = "00" + (now.getDate());
        let Hour = "00" + ( now.getHours());
        let Min = "00" + (now.getMinutes());
        let Sec = "00" + (now.getSeconds());
        return Year.slice(-2) + "/" + Month.slice(-2) + "/" + day.slice(-2) + "  " + Hour.slice(-2) + ":" + Min.slice(-2) + ":" + Sec.slice(-2);
    }
    const diffReturnWeight = function(diff){
        let score = 0;
        switch (diff) {
            case 'A':
                score = 2;
                break;
            case 'B':
                score = 5;
                break;
            case 'L':
                score = 1;
                break;
            case 'N':
                score = 4;
                break;
            case 'H':
                score = 3;
                break;
            default:
                break;
        }
        return score;
    }
    
    const bus = new Vue();
    new Vue ({
        el: '#main',
        data: {
            'musicData': Object,
            'date': String,
            'sortType': String,
            'results': Object,
            'playerSelResults': Object,
            'rivalSelResults': Object,
            'totalAvg': Number,
            'playerAvg': Number,
            'rivalAvg': Number,
            'musicAvgRanking': Object,
        },
        mounted: function(){
            this.date = getNowDate();
            this.sortType = '登録順';
            this.musicData = JSON.parse(localStorage.getItem('musicdata'));
            if(this.musicData == void 0){
                this.musicData = [];
            }
            console.log(this.musicData);
        },
        computed: {
        },
        methods: {
            //history
            loadHistory: function(){
                $('.hisModal').css('display', 'block');
                let rankCnt = [0,0,0,0];
                let rivalCnt = [0,0,0,0];
                let playerCnt = [0,0,0,0];
                let dataArr = this.musicData;
                this.musicAvgRanking = [];
                //rank
                dataArr.forEach((val, id)=>{
                    let songCnt = [0,0,0,0];
                    val.data.forEach((v,i) => {
                        switch (v.gameRank) {
                            case 'first':
                                rankCnt[0]++;
                                songCnt[0]++;
                                v.selector == 'player' ? playerCnt[0]++ : rivalCnt[0]++;
                                break;
                            case 'second':
                                rankCnt[1]++;
                                songCnt[1]++;
                                v.selector == 'player' ? playerCnt[1]++ : rivalCnt[1]++;
                                break;
                            case 'third':
                                rankCnt[2]++;
                                songCnt[2]++;
                                v.selector == 'player' ? playerCnt[2]++ : rivalCnt[2]++;
                                break;
                            case 'fourth':
                                rankCnt[3]++;
                                songCnt[3]++;
                                v.selector == 'player' ? playerCnt[3]++ : rivalCnt[3]++;
                                break;
                            default:
                                break;
                        }
                    });
                    let songAvgData = {
                        'title': val.title,
                        'diff': val.difficult,
                        'avg': Number((songCnt.reduce((p, c, i) => {return p+c*(i+1)}) / songCnt.reduce((p, c) => {return p+c})).toFixed(2)),
                        'cnt': songCnt.reduce((p, c) => {return p+c}),
                    };
                    this.musicAvgRanking.push(songAvgData);
                });
                this.results = rankCnt;
                this.playerSelResults = playerCnt;
                this.rivalSelResults = rivalCnt;
                this.totalAvg = (rankCnt.reduce((p, c, i) => {return p+c*(i+1)}) / rankCnt.reduce((p, c) => {return p+c})).toFixed(2);
                this.playerAvg = (playerCnt.reduce((p, c, i) => {return p+c*(i+1)}) / playerCnt.reduce((p, c) => {return p+c})).toFixed(2);
                this.rivalAvg = (rivalCnt.reduce((p, c, i) => {return p+c*(i+1)}) / rivalCnt.reduce((p, c) => {return p+c})).toFixed(2);
                console.log(this.results)
                this.musicAvgRanking.sort(function(a,b){
                    if(a.cnt > b.cnt) return -1;
                    if(a.cnt < b.cnt) return 1;
                    return 0;
                });
                this.musicAvgRanking.sort(function(a,b){
                    if(a.avg > b.avg) return 1;
                    if(a.avg < b.avg) return -1;
                    return 0;
                });

                diffArr.forEach((val, id) => {
                    $('.musicRanking').removeClass(val);
                })
                this.musicAvgRanking.forEach((val, id) => {
                    console.log(selectDiffColor(val.diff));
                    $('.musicRanking').eq(id + 1).children('.avgtitle').addClass(selectDiffColor(val.diff));
                });
            },
            closeHistory: function(){
                $('.hisModal').css('display', 'none');
            },
            //add//

            addMusicData: function(){
                //reset
                $('.songname').val('');
                $('.songmemo').val('');
                diffArr.forEach((val, id) => {
                    $('.diffBtn').removeClass(`${val}--select`);
                })
                $(`.selDiff > .another`).addClass(`another--select`);
                inputData = {
                    'title': '',
                    'difficult': 'A',
                    'level': Number($('.levelPrint').text()),
                    'data': [{
                        'date': this.date,
                        'selector': $('.songSelector > .select').attr('class').split(' ')[1],
                        'option': $('.selOption > .select').attr('class').split(' ')[1],
                        'arenaRank': $('.rankPrint').text(),
                        'scoreRank': $('.selScore > .select').attr('class').split(' ')[1],
                        'gameRank': $('.selGameRank > .select').attr('class').split(' ')[1],
                        'memo': ''
                    }]
                }

                $('.addModal').css('display', 'block');
                console.log(inputData);
                this.date = getNowDate();
            },
            closeRegister: function(){
                $('.addModal').css('display', 'none');
            },
            changeSelDiff: function(type){
                console.log(type)
                diffArr.forEach((val, id) => {
                    $('.diffBtn').removeClass(`${val}--select`);
                })
                $(`.selDiff > .${type}`).addClass(`${type}--select`);
                inputData.difficult = type.slice(0, 1).toUpperCase();
            },
            changeSelector: function(type){
                $('.selectorBtn').removeClass(`select`);
                $(`.${type}`).addClass(`select`);
                inputData.data[0].selector = type;
            },
            changeSelOption: function(type){
                $('.optBtn').removeClass(`select`);
                $(`.${type}`).addClass(`select`);
                inputData.data[0].option = type;
            },
            levelChange: function(type){
                let level = Number($('.levelPrint').text());
                let diff = (type == 'plus') ? 1 : -1 ;
                if(level + diff < 13 && level + diff > 0) level += diff;
                $('.levelPrint').text(level);
                inputData.level = level;
            },
            rankChange: function(type){
                let rank = $('.rankPrint').text();
                let diff = (type == 'plus') ? 1 : -1 ;
                let id = rankArr.findIndex(item => item === rank);
                $('.rankPrint').text(rankArr[id + diff]);
                inputData.data[0].arenaRank = rankArr[id + diff];
            },
            changeScore: function(type){
                $('.scoreBtn').removeClass(`select`);
                $(`.${type}`).addClass(`select`);
                inputData.data[0].scoreRank = type;
            },
            changeGameRank: function(type){
                $('.rankBtn').removeClass(`select`);
                $(`.${type}`).addClass(`select`);
                inputData.data[0].gameRank = type;
            },
            registerData: function(){
                inputData.title = $('.songname').val();
                inputData.data[0].memo = $('.songmemo').val();
                if(inputData.title == ''){}
                else{
                    this.musicData = JSON.parse(localStorage.getItem('musicdata'));
                    let index = this.musicData.findIndex(item => {
                        if(item.title === inputData.title && item.difficult === inputData.difficult) return true;
                    })
                    if(index === -1){
                        this.musicData.push(inputData);
                    } else {
                        this.musicData[index].data.push(inputData.data[0]);
                    }
                    localStorage.setItem('musicdata', JSON.stringify(this.musicData));
                    $('.addModal').css('display', 'none');
                }
            },
            sortMusicName: function(){
                if(this.sortType == '曲名降順') {
                    this.musicData = JSON.parse(localStorage.getItem('musicdata'));
                    this.sortType = '登録順';
                }else if(this.sortType == '曲名昇順'){
                    this.musicData.sort(function(a,b){
                        if(a.title > b.title) return -1;
                        if(a.title < b.title) return 1;
                        return 0;
                    });
                    this.sortType = '曲名降順';
                }else {
                    this.musicData.sort(function(a,b){
                        if(a.title > b.title) return 1;
                        if(a.title < b.title) return -1;
                        return 0;
                    });
                    this.sortType = '曲名昇順';
                }

            },
            sortMusicDiff: function(){
                if(this.sortType == '難易度降順') {
                    this.musicData = JSON.parse(localStorage.getItem('musicdata'));
                    this.sortType = '登録順';
                }else if(this.sortType == '難易度昇順'){
                    this.musicData.sort(function(a,b){
                        if(diffReturnWeight(a.difficult) > diffReturnWeight(b.difficult)) return -1;
                        if(diffReturnWeight(a.difficult) < diffReturnWeight(b.difficult)) return 1;
                        return 0;
                    })
                    this.sortType = '難易度降順';
                }else {
                    this.musicData.sort(function(a,b){
                        if(diffReturnWeight(a.difficult) > diffReturnWeight(b.difficult)) return 1;
                        if(diffReturnWeight(a.difficult) < diffReturnWeight(b.difficult)) return -1;
                        return 0;
                    })
                    this.sortType = '難易度昇順';
                }
            },
            sortMusicLV: function(){
                if(this.sortType == 'レベル昇順') {
                    this.musicData = JSON.parse(localStorage.getItem('musicdata'));
                    this.sortType = '登録順';
                }else if(this.sortType == 'レベル降順'){
                    this.musicData.sort(function(a,b){
                        if(a.level > b.level) return 1;
                        if(a.level < b.level) return -1;
                        return 0;
                    })
                    this.sortType = 'レベル昇順';
                }else {
                    this.musicData.sort(function(a,b){
                        if(a.level > b.level) return -1;
                        if(a.level < b.level) return 1;
                        return 0;
                    });
                    this.sortType = 'レベル降順';
                }
            },
            sortMusicCnt: function(){
                if(this.sortType == '回数昇順') {
                    this.musicData = JSON.parse(localStorage.getItem('musicdata'));
                    this.sortType = '登録順';
                }else if(this.sortType == '回数降順'){
                    this.musicData.sort(function(a,b){
                        if(a.data.length > b.data.length) return 1;
                        if(a.data.length < b.data.length) return -1;
                        return 0;
                    })
                    this.sortType = '回数昇順';
                }else {
                    this.musicData.sort(function(a,b){
                        if(a.data.length > b.data.length) return -1;
                        if(a.data.length < b.data.length) return 1;
                        return 0;
                    });
                    this.sortType = '回数降順';
                }
            },

        }
    });

    new Vue({
        el: '#modal-trigger',
        methods: {
            execute: function(){
                console.log(',mgoe')
                bus.$emit('click.trigger');
            },
        }
    });

    Vue.component('musicdata-tmpl', {
        template: '#musicdata-insert',
        props: {
            'data': Object,
            'item': Number,
            'opened': Boolean,
            'rankCnt': Array,
            'optionRank': Object,
            'scoreRankArr': Array,
            'normalizeData': Object
        },
        mounted: function(){
            let diffType = '';
            switch (this.data.difficult) {
                case 'A':
                    diffType = 'another';
                    break;
                case 'B':
                    diffType = 'begginer';
                    break;
                case 'L':
                    diffType = 'legen';
                    break;
                case 'N':
                    diffType = 'normal';
                    break;
                case 'H':
                    diffType = 'hyper';
                    break;
                default:
                    break;
                }

                $('.music__difficult').eq(this.item + 1).addClass(diffType);
        },
        methods: {
            //songData//
            open: function(){
                diffArr.forEach((val, id) => {
                    $('.songData--title').removeClass(val);
                    $('.areaTopTitle').removeClass(val);
                })
                $('.songData--title').addClass(selectDiffColor(this.data.difficult));
                $('.areaTopTitle').addClass(selectDiffColor(this.data.difficult));
                this.rankCnt = [0,0,0,0];
                let dataArr = this.data.data;
                //rank
                dataArr.forEach((val, id)=>{
                    switch (val.gameRank) {
                        case 'first':
                            this.rankCnt[0]++;
                            break;
                        case 'second':
                            this.rankCnt[1]++;
                            break;
                        case 'third':
                            this.rankCnt[2]++;
                            break;
                        case 'fourth':
                            this.rankCnt[3]++;
                            break;
                        default:
                            break;
                    }
                });
                //opRank,opScore
                this.scoreRankArr = scoreRankArr;
                this.optionRank = [];
                optionArr.forEach((op) => {
                    let addOption = {'option' : op};
                    addOption.rankCnt = [0,0,0,0];
                    addOption.ScoreCnt = [0,0,0,0,0]
                    dataArr.forEach((val, id)=>{
                        if(val.option == op){
                            switch (val.gameRank) {
                                case 'first':
                                    addOption.rankCnt[0]++;
                                    break;
                                case 'second':
                                    addOption.rankCnt[1]++;
                                    break;
                                case 'third':
                                    addOption.rankCnt[2]++;
                                    break;
                                case 'fourth':
                                    addOption.rankCnt[3]++;
                                    break;
                                default:
                                    break;
                            }
                            switch (val.scoreRank) {
                                case 'rankMAX':
                                    addOption.ScoreCnt[0]++;
                                    break;
                                case 'rankAAA':
                                    addOption.ScoreCnt[1]++;
                                    break;
                                case 'rankAA':
                                    addOption.ScoreCnt[2]++;
                                    break;
                                case 'rankA':
                                    addOption.ScoreCnt[3]++;
                                    break;
                                case 'rankB':
                                    addOption.ScoreCnt[4]++;
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    addOption.option = optionNormalize(addOption.option);
                    this.optionRank.push(addOption);
                    //console.log(this.optionRank)
                });
                //history
                let normalizeData = JSON.parse(JSON.stringify(dataArr)).reverse();
                console.log(dataArr)
                normalizeData.forEach((val, id) => {
                    normalizeData[id].option = optionNormalize(val.option);
                    normalizeData[id].scoreRank = scoreRankNormalize(val.scoreRank);
                    normalizeData[id].gameRank = gameRankNormalize(val.gameRank);
                    normalizeData[id].selector = selectorNormalize(val.selector);
                    normalizeData[id].memo = val.memo;
                });

                this.normalizeData = normalizeData;
                this.opened = true;
            },
            close: function(){
                this.opened = false;
            }
        },
        created: function(){
            bus.$on('click.trigger', this.open);
        },
        computed: {
            diffColor: function(){
                diffArr.forEach((val, id) => {
                    $('.music__difficult').eq(this.item + 1).removeClass(val);
                })
                
                $('.music__difficult').eq(this.item + 1).addClass(selectDiffColor(this.data.difficult));
            },
        },
    });
    
    const selectDiffColor = function(diff){
        let diffType = '';
        switch (diff) {
            case 'A':
                diffType = 'another';
                break;
            case 'B':
                diffType = 'begginer';
                break;
            case 'L':
                diffType = 'legen';
                break;
            case 'N':
                diffType = 'normal';
                break;
            case 'H':
                diffType = 'hyper';
                break;
            default:
                break;
        }
        return diffType;
    };
    
    const optionNormalize = function(option){
        let opType = '';
        switch (option) {
            case 'default':
                opType = '正';
                break;
            case 'mirror':
                opType = '鏡';
                break;
            case 'random':
                opType = '乱';
                break;
            case 'r-random':
                opType = 'Ｒ';
                break;
            case 's-random':
                opType = 'Ｓ';
                break;
            default:
                break;
        }
        return opType;
    };

    const scoreRankNormalize = function(option){
        let opType = '';
        switch (option) {
            case 'rankMAX':
                opType = scoreRankArr[0];
                break;
            case 'rankAAA':
                opType = scoreRankArr[1];
                break;
            case 'rankAA':
                opType = scoreRankArr[2];
                break;
            case 'rankA':
                opType = scoreRankArr[3];
                break;
            case 'rankB':
                opType = scoreRankArr[4];
                break;
            default:
                break;
        }
        return opType;
    };
    const gameRankNormalize = function(option){
        let opType = '';
        switch (option) {
            case 'first':
                opType = '1位';
                break;
            case 'second':
                opType = '2位';
                break;
            case 'third':
                opType = '3位';
                break;
            case 'fourth':
                opType = '4位';
                break;
            default:
                break;
        }
        return opType;
    };
    const selectorNormalize = function(option){
        let opType = '';
        switch (option) {
            case 'player':
                opType = '自分';
                break;
            case 'rival':
                opType = '相手';
                break;
            default:
                break;
        }
        return opType;
    };
});