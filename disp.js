$(() => {
	// サイズ調整
	resizeDisp();
	$(window).on('resize', resizeDisp);
	// LED横位置設定
	$('.out').css('left', '+=21px');
	$('.in').css('left', '+=313px');
	// 2段目->次発
	dispInfo('in', 'none');
	dispInfo('out', 'none');
	// 時刻更新 5秒毎
	setInterval(() => {
		setTime();
	}, 5 * 1000);
})

let hour;
let min;
let currentTime = 0;
let timeTable = [];
let currentRow = []; 
let currentDisp = [];
let currentMin = [];
let apprch = [];
currentRow['in'] = 0;
currentRow['out'] = 0;
currentDisp['in'] = '';
currentDisp['out'] = '';
apprch['in'] = false;
apprch['out'] = false;
currentMin['in'] = 60;
currentMin['out'] = 60;

$.getJSON(`timetable/inbound.json`, (data) => {
	timeTable.in = data;
})
$.getJSON(`timetable/outbound.json`, (data) => {
	timeTable.out = data;
})

const resizeDisp = () => {
	winWidth = $(window).width() - 5;
	winHeight = $(window).height() / 3;
	frameMultipiler = Math.floor(winWidth / 490 * 10) / 10;
	$('#disp').css({
	'transform': `scale(${frameMultipiler})`,
	'margin-bottom': `${81 * (frameMultipiler - 1) + 10}px`,
	'width': 1,
	'margin-top': winHeight
	})
}
function setTime() {
	let date = new Date();
	hour = date.getHours();
	min = date.getMinutes();
	// 時計の針を動かす
	$('#hand_hour').css('transform', `rotate(${(hour * 30 - 180) + (min / 2)}deg)`);
	$('#hand_min').css('transform', `rotate(${min * 6 + 180}deg)`);

	if(hour == 5) {
		currentRow['in'] = 0;
		currentRow['out'] = 0;
		dispTime();
	}

	while(Number(timeTable['in'][currentRow['in']]['dep']) < (hour * 100 + min)){
		if(Number(currentRow['in']) + 1 == Number(timeTable['in'].length)){
			dispInfo('in', 'end');
			break;
		}
		apprch['in'] = false;
		currentRow['in'] ++;
		dispTime();
	}
	while(Number(timeTable['out'][currentRow['out']]['dep']) < (hour * 100 + min)) {
		if(Number(currentRow['out']) + 1 == Number(timeTable['out'].length)){
			dispInfo('out', 'end');
			break;
		}
		apprch['out'] = false;
		currentRow['out'] ++;
		dispTime();
	}

	// 接近
	if(Number(timeTable['in'][currentRow['in']]['arr']) == (hour * 100 + min) && !apprch['in']) {
		dispInfo('in', 'apprch');
	} else if(currentMin['in'] != min && timeTable['in'][currentRow['in']]['1_arr'] < (hour * 100 + min)) {
		currentMin['in'] = min;
		setPos('in');
		dispInfo('in', 'pos');
	}
	if(Number(timeTable['out'][currentRow['out']]['arr']) == (hour * 100 + min) && !apprch['out']) {
		dispInfo('out', 'apprch');
	} else if(currentMin['out'] != min && timeTable['out'][currentRow['out']]['1_arr'] < (hour * 100 + min)) {
		currentMin['out'] = min;
		setPos('out');
		dispInfo('out', 'pos');
	}
}
// 発車標表示更新
const dispTime = () => {
	$('.in.row1.type').attr('src', `type/${timeTable['in'][currentRow['in']]['type']}.png`);
	$('.in.row1.h1').attr('src', `num/${timeTable['in'][currentRow['in']]['dep'][0]}.png`);
	$('.in.row1.h0').attr('src', `num/${timeTable['in'][currentRow['in']]['dep'][1]}.png`);
	$('.in.row1.m1').attr('src', `num/${timeTable['in'][currentRow['in']]['dep'][2]}.png`);
	$('.in.row1.m0').attr('src', `num/${timeTable['in'][currentRow['in']]['dep'][3]}.png`);
	$('.in.row1.dest').attr('src', `dest/${timeTable['in'][currentRow['in']]['dest']}.png`);
	if(timeTable['in'][currentRow['in']]['cars']) $('.in.row1.cars').attr('src', `cars/${timeTable['in'][currentRow['in']]['cars']}.png`);

	if(currentRow['in'] < (timeTable['in'].length - 1)) {
		$('.in.row2.type').attr('src', `type/${timeTable['in'][currentRow['in'] + 1]['type']}.png`);
		$('.in.row2.h1').attr('src', `num/${timeTable['in'][currentRow['in'] + 1]['dep'][0]}.png`);
		$('.in.row2.h0').attr('src', `num/${timeTable['in'][currentRow['in'] + 1]['dep'][1]}.png`);
		$('.in.row2.m1').attr('src', `num/${timeTable['in'][currentRow['in'] + 1]['dep'][2]}.png`);
		$('.in.row2.m0').attr('src', `num/${timeTable['in'][currentRow['in'] + 1]['dep'][3]}.png`);
		$('.in.row2.dest').attr('src', `dest/${timeTable['in'][currentRow['in'] + 1]['dest']}.png`);
		if(timeTable['in'][currentRow['in'] + 1]['cars']) $('.in.row2.cars').attr('src', `cars/${timeTable['in'][currentRow['in'] + 1]['cars']}.png`);
	} else {
		$('.in.row2.cln').css('display', 'none');
		$('.in.row2.type').attr('src', ``);
		$('.in.row2.h1').attr('src', ``);
		$('.in.row2.h0').attr('src', ``);
		$('.in.row2.m1').attr('src', ``);
		$('.in.row2.m0').attr('src', ``);
		$('.in.row2.dest').attr('src', ``);
		$('.in.row2.cars').attr('src', ``);
	}

	$('.out.row1.type').attr('src', `type/${timeTable['out'][currentRow['out']]['type']}.png`);
	$('.out.row1.h1').attr('src', `num/${timeTable['out'][currentRow['out']]['dep'][0]}.png`);
	$('.out.row1.h0').attr('src', `num/${timeTable['out'][currentRow['out']]['dep'][1]}.png`);
	$('.out.row1.m1').attr('src', `num/${timeTable['out'][currentRow['out']]['dep'][2]}.png`);
	$('.out.row1.m0').attr('src', `num/${timeTable['out'][currentRow['out']]['dep'][3]}.png`);
	$('.out.row1.dest').attr('src', `dest/${timeTable['out'][currentRow['out']]['dest']}.png`);
	if(timeTable['out'][currentRow['out']]['cars']) $('.out.row2.cars').attr('src', `cars/${timeTable['out'][currentRow['out']]['cars']}.png`);

	if(currentRow['out'] < (timeTable['out'].length - 1)) {
		$('.out.row2.type').attr('src', `type/${timeTable['out'][currentRow['out'] + 1]['type']}.png`);
		$('.out.row2.h1').attr('src', `num/${timeTable['out'][currentRow['out'] + 1]['dep'][0]}.png`);
		$('.out.row2.h0').attr('src', `num/${timeTable['out'][currentRow['out'] + 1]['dep'][1]}.png`);
		$('.out.row2.m1').attr('src', `num/${timeTable['out'][currentRow['out'] + 1]['dep'][2]}.png`);
		$('.out.row2.m0').attr('src', `num/${timeTable['out'][currentRow['out'] + 1]['dep'][3]}.png`);
		$('.out.row2.dest').attr('src', `dest/${timeTable['out'][currentRow['out'] + 1]['dest']}.png`);
		if(timeTable['out'][currentRow['out'] + 1]['cars']) $('.out.row2.cars').attr('src', `cars/${timeTable['out'][currentRow['out'] + 1]['cars']}.png`);
	} else {
		$('.out.row2.cln').css('display', 'none');
		$('.out.row2.type').attr('src', ``);
		$('.out.row2.h1').attr('src', ``);
		$('.out.row2.h0').attr('src', ``);
		$('.out.row2.m1').attr('src', ``);
		$('.out.row2.m0').attr('src', ``);
		$('.out.row2.dest').attr('src', ``);
		$('.out.row2.cars').attr('src', ``);
	}
}
// 発車標2段目に表示する情報
// none:次発, apprch:列車がまいります, end:運転終了, pos:在線位置
const dispInfo = (__direction, __type) => {
	if(currentDisp[__direction] == __type) return;
	currentDisp[__direction] = __type;
	$(`.${__direction}.row1`).css('visibility', 'visible');
	$(`.${__direction}.row2.marker`).css('visibility', 'hidden');
	$(`.${__direction}.row2:not(.info)`).css('visibility', 'hidden');
	if(__type == 'none') {
		$(`.${__direction}.row2.info`).css('visibility', 'hidden');
		$(`.${__direction}.row2:not(.info)`).css('visibility', 'visible');
	} else if(__type == 'apprch') {
		$(`.${__direction}.row2:not(.msg)`).css('visibility', 'hidden');
		$(`.${__direction}.row2.msg`).css('visibility', 'visible');
		$(`.${__direction}.row2.msg`).attr('src', 'coming.gif');
		apprch[__direction] = true;
		// 40秒後に次発に戻す
		setTimeout(() => {
			dispInfo(__direction, 'none');
		}, 40 * 1000);
	} else if(__type == 'end') {
		$(`.${__direction}.row1`).css('visibility', 'hidden');
		$(`.${__direction}.row2:not(.msg)`).css('visibility', 'hidden');
		$(`.${__direction}.row2.msg`).css('visibility', 'visible');
		$(`.${__direction}.row2.msg`).attr('src', 'ended.png');
		$(`.${__direction}.row2`).css('display', 'visible');
	} else if(__type == 'pos') {
		$(`.${__direction}.row2.marker`).css('visibility', 'visible');
		$(`.${__direction}.row2.msg`).css('visibility', 'visible');
		$(`.${__direction}.row2.msg`).attr('src', 'trainpos.png');
		// 5秒後に次発に戻す
		setTimeout(() => {
			dispInfo(__direction, 'none');
		}, 5 * 1000);
	}
}
// 在線位置マーカーの設定
const setPos = (__direction, __pos) => {
	let marker = $(`.${__direction}.row2.marker`);
	if(__direction == 'out') pos = 21;
	if(__direction == 'in') pos = 313;
	let time = hour * 100 + min;
	if(timeTable[__direction][currentRow[__direction]]['3_dep'] < time) marker.css('left', `${pos + 115}px`);
	else if(timeTable[__direction][currentRow[__direction]]['3_arr'] < time) marker.css('left', `${pos + 91}px`);
	else if(timeTable[__direction][currentRow[__direction]]['2_dep'] < time) marker.css('left', `${pos + 69}px`);
	else if(timeTable[__direction][currentRow[__direction]]['2_arr'] < time) marker.css('left', `${pos + 46}px`);
	else if(timeTable[__direction][currentRow[__direction]]['1_dep'] < time) marker.css('left', `${pos + 23}px`);
	else if(timeTable[__direction][currentRow[__direction]]['1_arr'] < time) marker.css('left', `${pos + 1}px`);
	console.log(__direction);
	console.log(marker.css('left'));
}
