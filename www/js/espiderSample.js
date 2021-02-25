/**
 * espiderSample.js
 * 
 * v1.3.1
 * 
 * + v1.3.0 [20170614 djlee]
 * 		- 샘플 리뉴얼.
 * + v1.3.1 [20170705 djlee]
 * 		- UI 수정
 * + v1.3.2 [20190524 marco]
 * 		- macOS / window 플랫폼별 다운로드 경로 지정
 *
 *    
 * Copyright (c) Heenam Co.,Ltd All Rights Reserved
 */

/***********************************************************************************************************
 *  - 이 샘플의 UI, 소스코드, 리소스는 E-Spider라이브러리를 테스트 및 개발시 이해를 돕기위한 용도로 작성 되었으며 
 *    E-Spider 라이브러리에 포함된 사항이 아닙니다.(espider.js, espider.io.js 제외)
 *    
 *  - 실제 개발 적용시에는 반드시 아래 사항을 준수 하여야 합니다.
 *    1) 소스코드(javascript)는 프로젝트 상황에 맞게 수정하고 불필요한 소스코드는 삭제 해야 합니다.
 *    2) E-Spider의 프로세스를 설명하고 있는 주석을 제거해야 합니다.
 *    3) 샘플에 포함된 jsvascript를 제외한 리소스(HTML, 이미지, css등)을 개발에 사용해서는 안됩니다.(사용을 원할경우 반드시 협의 후 사용하여야 합니다.)
 ***********************************************************************************************************/

var jobArray = [];		// 실행할 job array
var certInfo = {};		// 선택한 인증서 정보
var certPassword = "";	// 입력한 인증서 패스워드

var resultArray = [];		// 결과 array

//var isEspiderConnected = false;		// 초기화 및 연결 상태

var isListenerAdded = false;			// 리스너 등록 상태

// TODO 설치파일 url 변경 
var espiderInstaller = 
	// Window
	/window/.test(navigator.userAgent.toLowerCase()) ? "../EspiderInstaller.exe" :
	// macOS
	/mac/.test(navigator.userAgent.toLowerCase()) ? "../espiderMac-2.1.7.dmg" : "";

//TODO 라이센스 변경 
espider.options.license = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";	// License

//TODO 호스트 변경 
espider.options.host = "xxxxxxxx.xx.xx";
                        
/*
 * TODO 결과값(resultJson) 암호화 여부 설정 
 *   - true일 경우 결과 데이터를 클라이언트에서 확인 불가(서버에 전송후 별도 제공하는 복호화 샘플소스로 복호화 가능)
 */
espider.options.encrypt = false;

//TODO input/output 서버 암복호화 적용시 설정값 
espider.options.opt1 = false; 											// use encrypted input data
espider.options.opt2 = "6162636465666768696A6B6C6D6E6F7071727374"; 		// random HEX string	(해당 암호화 값은 랜덤으로 사용하는것을 권장하며, 암복호화 가이드 문서를 참조바랍니다.)
espider.options.opt3 = 3;												// hash algorithm (1:SHA1, 2:SHA224, 3:SHA256, 4:SHA384, 5:SHA512)
espider.options.opt4 = 10;												// encryption algorithm (10:SEED, 11:AES128)
espider.options.opt5 = "0106000704040404080807010403030303030303"; 		// salt
espider.options.opt6 = 512;												// iterator
espider.options.opt7 = "4D6F62696C655472616E734B65793130";				// iv
espider.options.opt8 = true;												// use PKCS5Padding
espider.options.opt9 = 1;												// input/output Data Type (0:BASE64, 1:HEX string)

//TODO 로그 출력 설정. 운영 배포시 반드시 확인!
espider._show_log = true;

//TODO espider 로그를 호출한 파일 및 라인 출력 여부 설정.
espider._print_caller = false;

/*
 * TODO 엔진의 최대 Thread 수 설정.
 * 많이 설정 할수록 여러개의 job을 처리할 때 속도가 증가하지만 사양이 낮은 PC에서는 엔진이 멈추는 현상이 발생 할 수 있음.
 */  
espider._jobInfo.threadCount = 64;

$(function(){
	// JobList 초기화
	fn_ClearJob();
});
		
// Page Finish
$(window).on("beforeunload", function(){
	// 엔진 종료.
	fn_EngineFinalize();
	
	// Delay for Finish - 엔진 Finalize가 완료될 시간을 준다.
	var start = +new Date;
    while ((+new Date - start) < 500);
});

/*
 * 인증서팝업 호출
 * TODO 인증서 리스트 팝업의 디자인, UI, 기능은 솔루션에 포함된 사항이 아니며 이해를 돕기위해 작성한 것입니다.
 * 띠라서 개발시에는 해당 사이트의 인증서 모듈을 사용하거나 e-spider Engine의 인증서 목록 호출 기능(engineGetCertification)
 * 이용해 직접 구현 하여야 합니다.
 */
function fn_loadCertDialog(onCertSelected){

	/*if(!espider._connected) {
		alert("Initialization 실행후 진행하시기 바랍니다.");
		return;
	}*/
	
	//external 보안 키패드를 사용 할 경우 true.(default : false)
	ecertDialog.externalInput = false;
	
	//만료된 인증서  노출 여부(true : 표시, false : 미표시, default : 미표시)
	ecertDialog.certShowGbn = false;

	//확인 callback
	ecertDialog.addListner("OnConfirmClick", function(selectedCert, password) {
		espider._log("OnConfirmClick :: " + JSON.stringify(selectedCert));
		espider._log("OnConfirmClick :: " + password);
		
		certInfo = selectedCert;		//인증서 정보
		certPassword = password;	//인증서 패스워드
		
		if(typeof onCertSelected == "function"){
			onCertSelected(selectedCert);
		}
	});

	//취소 callback
	ecertDialog.addListner("OnCancelClick", function() {
		espider._log("OnCancelClick :: ");
	});

	//drive cert list
	ecertDialog.addListner("OnLoadCertification", function(driveLetter) {
		espider._log("OnLoadCertification driveLetter :: " + driveLetter);
		
		//espider get cert list
		espider.engineGetCertification(driveLetter, function(objCertList) {
			espider._log(JSON.stringify(objCertList));
			
			ecertDialog.displayCert(objCertList);	
		});
	});
	
	//인증서 팝업 drive setting
	ecertDialog.addListner("OnLoadExtraDrive", function() {
		//espier get external drive
		espider.engineGetExternalDrive(function(objExternalDriveList) {
			espider._log(JSON.stringify(objExternalDriveList));
			
			ecertDialog.displayExtdrive(objExternalDriveList);
		});
	});

	ecertDialog.addListner("OnShow", function() {
		espider._log("OnShow showing");
	});

	ecertDialog.addListner("OnClose", function(e) {
		espider._log("OnClose ");
	});

	ecertDialog.addListner("OnPassValidate", function(external, errcode) {
		//external true 이면 보안 키패드를 validate check 처리 한다.
		//external 반드시 sync로 결과를 리턴 해준다.
		//errcode 는 external이 false 일경우만 넘어오고 오류가 있을 때만 호출 된다.
		espider._log("OnPassValidate :: ");

		if (external) {
			
		} else {
			//error E10001 password type error
			//error E10002 password minlen
			//error E10003 certification not selected
			espider._log("errcode :: " + errcode);
			
			switch (errcode){
				case "E10001":
					alert("password type error");
				break;
				case "E10002":
					alert("password minlen");
				break;
				case "E10003":
					alert("certification not selected");
				break;
				
				default:
				break;
			}							
		}

		return true;
	});

	ecertDialog.addListner("OnCreatePassword", function(parent) {
		//external 보안 키패드를 사용 할 경우 해당 코딩으로 키패드를 만들어 준다..

		espider._log("OnCreatePassword ");

		var certpassInput = document.createElement("input");
		certpassInput.setAttribute("type", "password");
		certpassInput.setAttribute("id", "certPassword");
		certpassInput.setAttribute("maxlength", 30);

		parent.appendChild(certpassInput);	
	});

	ecertDialog.showDialog();
}

/**
 * espider api 
 */

// 엔진 초기화 - 설치여부, 버전, 포트 체크
function fn_EnginInitialize() {
	espider.initialization(function() {
		if(arguments[0]) {
			espider._log("Initialization success.");
		} else {
			// 초기화 실패시 타이머 연결상태 확인하는 타이머 종료.
			clearInterval(espider._timerInter);
			
			if(typeof arguments[1] != "undefined") {
				espider._log("Initialization failed. Error : " + arguments[1]);		
				if(arguments[1] == "E010001") {
					// VersionCheck
					alert("Espider를 업데이트하시기 바랍니다.");
					
					// 업데이트 필요한 경우 다운로드 유도.
					location.href = espiderInstaller;
				} else if(arguments[1] == "E010002") {
					// Not installed
					alert("Espider를 설치하시기 바랍니다.");
					
					// Espider 설치되지 않은 경우 다운로드 유도.
					location.href = espiderInstaller;
				} else if(arguments[1] == "E020001") {
					// PortCheck Error
				} else if(arguments[1] == "E020002") {
					// PortCheck Error
				} else {
					// UnKnown Error
				}
			}
		}
	});
	
	// 엔진 연결상태 확인하는 타이머 설정.
//	espider._timerInter = setInterval(function() {
//		if(espider._connected) {
//			// 연결이 완료되면 타이머 종료하고 연결상태 변경.
//			espider._log("Engine connected.");
//			clearInterval(espider._timerInter);
//			isEspiderConnected = true;
//		}
//	}, 300);
}

// Listener(interface) 등록
function fn_AddListener(callbackFnMap){
	// 엔진이 초기화 되지 않은경우.
	/*if(!espider._connected) {
		alert("Initialization 실행후 진행하시기 바랍니다.");
		return;
	}*/
	
	// 각 job의 상태가 변경될때 마다 호출되는 콜백
	espider.addListner("OnStatus", function(obj) {
		espider._log("OnStatus <<<");
		espider._log("    threadIdx : " + obj.threadIdx);
		espider._log("    jobIdx : " + obj.jobIdx);
		espider._log("    status : " + obj.status);
	});

	// 각 job의 진행률이 변경될때 마다 호출되는 콜백
	espider.addListner("OnPercent", function(obj) {
		espider._log("OnPercent <<<");
		espider._log("    threadIdx : " + obj.threadIdx);
		espider._log("    jobIdx : " + obj.jobIdx);
		espider._log("    percent : " + obj.percent);
		
		if(typeof callbackFnMap.onPercent == "function"){
			callbackFnMap.onPercent(obj.jobIdx, obj.percent);
		}
	});

	// 엔진이 스크래핑에 필요한 input파라미터를 가져가기 위해 호출되는 콜백
	// espider.engineSetParam 함수를 통해 엔진에서 요구하는 파라미터를 전달.
	espider.addListner("OnGetParam", function(obj) {
		espider._log("OnGetParam <<<");
		espider._log("    threadIdx : " + obj.threadIdx);
		espider._log("    jobIdx : " + obj.jobIdx);
		espider._log("    requireJSON : " + JSON.stringify(obj.requireJSON));
		
		var setParamData = jobArray[obj.jobIdx];
		setParamData.threadIdx = obj.threadIdx;
		setParamData.jobIdx = obj.jobIdx;
		
		espider._log("espider.engineSetParam >>>");
		espider._log("    setParamData : " + JSON.stringify(setParamData));
		
		espider.engineSetParam(setParamData);
	});

	// 각 job의 스크래핑이 완료되었을 때 스크래핑 결과와 함께 호출되는 콜백
	// errorcode가 0이면 성공, 0이 아니면 에러.
	espider.addListner("OnResult", function(obj) {
		espider._log("OnResult <<<");
		espider._log("    threadIdx : " + obj.threadIdx);
		espider._log("    jobIdx : " + obj.jobIdx);
		espider._log("    errorcode : " + (obj.errorcode & 0xFFF));
		espider._log("    usererror : " + obj.usererror);
		espider._log("    errormessage : " + obj.errormessage);
		espider._log("    resultJSON : " + JSON.stringify(obj.resultJSON));
		
		var resultObject = {};
		resultObject.jobIdx = obj.jobIdx;
		resultObject.errorcode = obj.errorcode & 0xFFF;
		resultObject.usererror = obj.usererror;
		resultObject.errormessage = obj.errormessage;
		resultObject.resultJSON = obj.resultJSON;
		
		// 결과 array에 결과 저장
		resultArray[obj.jobIdx] = resultObject;
		
		if(typeof callbackFnMap.onResult == "function"){
			// TODO 각 job별로 결과값이 리턴될때 마다 결과를 처리 하기 위해서는 여기서 처리. 
			callbackFnMap.onResult(resultObject);
		}
	});
	
	// 엔진의 진행 상태가 변경될때 마다 호출되는 콜백
	espider.addListner("OnEngineStatus", function(obj) {
		espider._log("OnEngineStatus <<<");
		espider._log("    status : " + obj.status);
		
		if(obj.status == 0) {
			// 모든 모듈(job)의 작업완료되면 status가 0 (idle)이 됨.
			espider._jobRunning = false;
			
			if(typeof callbackFnMap.onFinished == "function"){
				// TODO 모든 모듈(job)의 작업완료 후 결과 처리 하기 위해서는 여기서 처리.
				callbackFnMap.onFinished(resultArray);
			}
		}
	});

	// 엔진 내부에서 에러가 발생한 경우 호출되는 콜백
	espider.addListner("OnSystemError", function(obj) {
		espider._log("OnSystemError <<<");
		espider._log("    errorcode : " + (obj.errorcode & 0xFFF));
		espider._log("    errormessage : " + obj.errormessage);

		alert("OnSystemError :: " + (obj.errorcode & 0xFFF) + " :: " + obj.errormessage);
	});
	
	// 엔진 버전을 가져오는 콜백
	espider.addListner("espider_getVersion", function(obj) {
		espider._log("espider_getVersion <<<");
		espider._log("    engineVersion : " + obj);

		if(typeof callbackFnMap.onEnginVersion == "function"){
			// TODO 엔진 버전을 가져온 후 결과 처리
			callbackFnMap.onEnginVersion(obj);
		}
		
	});
	
	// 디바이스 정보 가져오는 콜백
	espider.addListner("espider_getDeviceInfo", function(deviceInfo){
 	 	espider._log("espider_getDeviceInfo <<<");
		espider._log("    deviceInfo : " + JSON.stringify(deviceInfo));

		if(typeof callbackFnMap.onDeviceInfo == "function"){
			// TODO 디바이스 UUID 을 가져온 후 결과 처리
			callbackFnMap.onDeviceInfo(deviceInfo);
		}
  });	
	
	// Listener 등록 완료
	isListenerAdded = true;
	
	espider._log("Listener Added.");
}

// Engine Stop
function fn_EngineFinalize() {
//	isEspiderConnected = false;
	espider._jobRunning = false;
	espider.finalization(function() {
		espider._log("Finalization success"); }
	);
}

// job 리스트 초기화.
function fn_ClearJob() {
	espider._jobInfo.jobArray = [];
	jobArray = [];
}
				
// Add Job
function fn_AddJob(paramCountry, paramOrganization, paramSuborganization, paramCode, setParamData) {
	jobArray.push(setParamData);
	
	var jobObj = {};
	jobObj.country = paramCountry;
	jobObj.organization = paramOrganization;
	jobObj.suborganization = paramSuborganization;
	jobObj.code = paramCode;
	
	espider._jobInfo.jobArray.push(jobObj);
	espider._log(JSON.stringify(espider._jobInfo));
	
	return espider._jobInfo;
}


//엔진이 start가능한 상황인지 체크하고, 이상이 없으면 엔진을 start한다.
function fn_startEngine() {
	if(!isListenerAdded) {
		alert("Listener 등록후 진행하시기 바랍니다.");
		return false;
	}
	
	if(jobArray.length < 1){
		alert("등록하신 업무가 없습니다. 업무 추가후 실행해 주시기 바랍니다.");
		return false;
	}

	// 인증서 정보가 없는경우(인증서를 선택하지 않은 경우)
	if(certPassword == ""){
		alert("인증서 선택후 진행하시기 바랍니다.");
		fn_loadCertDialog();
		return false;
	}
	
	// jobArray에 인증서 정보 추가
	$.each(jobArray, function (i, v){
		v.paramData.loginInfo.reqKeyFile		= certInfo["cert.key.path"];
		v.paramData.loginInfo.reqCertFile		= certInfo["cert.der.path"];
		v.paramData.loginInfo.reqCertPass		= certPassword;
		
	});
	
	engineStart();
	return true;
}

// Engine Start
function engineStart() {
	if(espider._jobRunning)	return;

	espider.engineStartWithJob(espider._jobInfo, function(bSuccess) {
		espider._log("engine start success " + bSuccess);
		
		if(bSuccess) {
			espider._jobRunning = true;
			startJob();
		}
	});
}

// Job Start
function startJob(){
	espider._log("engine start job");
	espider.engineStartJob(function(bSuccess) {
		espider._log("engine start job success " + bSuccess);
     });
}
 
//NOS 보안키패드 데이터 변환 - 보안키패드의 데이터를 스크래핑 엔진에 전달 가능한 암호화값으로 변환
function fn_NosToEspiderData(data, callback) {
	espider._log("fn_NosToEspiderData <<< ");
	espider._log("     data : " + JSON.stringify(data));
	
	espider.engineConvertNOS(data, function(retData) {
		espider._log("espider.engineConvertNOS >>> ");
		espider._log("     retData : " + JSON.stringify(retData));
		if(typeof callback == "function"){
			callback(retData);
		}
	});
}

//Ahnlab 보안키패드 데이터 변환 - 보안키패드의 데이터를 스크래핑 엔진에 전달 가능한 암호화값으로 변환
function fn_AhnlabToEspiderData(data, callback) {
	espider._log("fn_AhnlabToEspiderData <<< ");
	espider._log("     data : " + JSON.stringify(data));
	
	espider.engineConvertAhnlab(data, function(retData) {
		espider._log("espider.engineConvertAhnlab >>> ");
		espider._log("     retData : " + JSON.stringify(retData));
		if(typeof callback == "function"){
			callback(retData);
		}
	});		
}

// 국민건강보험공단 - 자격득실확인서		
function fn_KRPP0002010010(identity) {
	var setParamData = {};
	setParamData.paramData = {};

	// LoginInfo
	setParamData.paramData.loginInfo = {};
	setParamData.paramData.loginInfo.reqIdentity = identity;		// 주민등록번호
	
	// ParamInfo
	// TODO 사용 목적에 맞게 수정 필요
	setParamData.paramData.paramInfo = {};
	setParamData.paramData.paramInfo.reqIsIdentityViewYn		= "0";		// 주민번호공개여부 0:비공개, 1:공개
	setParamData.paramData.paramInfo.reqUseType 				= "0";		// 가입자구분 0:전체, 1:직장가입자, 2:지역가입자
	
	// AddJob
	return fn_AddJob("KR", "PP", "0002", "010010", setParamData);
}

// 국민건강보험공단 - 보험료납부확인서
function fn_KRPP0002010020(identity) {
	var setParamData = {};
	setParamData.paramData = {};

	// LoginInfo
	setParamData.paramData.loginInfo = {};
	setParamData.paramData.loginInfo.reqIdentity	= identity;		// 주민등록번호
	
	// ParamInfo
	// TODO 사용 목적에 맞게 수정 필요
	/* 
	 * TODO Important!
	 *  - 국민건강보험공단 - 보험료납부확인서 모듈의 경우, 조회 기간이 6개월 이상이고 년도를 넘겨 조회할 경우 반드시 년도를 나눠 2번 호출해야 함.(건보공단 버그)
	 *  - Ex) 201606 ~ 201705 조회 할 경우 = 201606 ~ 201612, 201701 ~ 201705와 같이 나눠서 두번 호출. 
	 */
	setParamData.paramData.paramInfo = {};
	setParamData.paramData.paramInfo.commStartDate 		= "201601";			// 조회시작년월 yyyyMM
	setParamData.paramData.paramInfo.commEndDate 		= "201612";			// 조회종료년월 yyyyMM
	setParamData.paramData.paramInfo.reqUsePurposes		= "2";					// 2: 납부확인용, 4: 연말정산용, 6: 학교제출용, 8: 종합소득세신고용
	setParamData.paramData.paramInfo.reqUseType			= "00";				// 00:건강-장기요양보험료, 01: 건강보험료, 02:장기요양보험료

	// Add Job
	return fn_AddJob("KR", "PP", "0002", "010020", setParamData);
}

// 국민건강보험공단 - 자격확인 
function fn_KRPP0002010060(identity) {
	var setParamData = {};
	setParamData.paramData = {};
	
	// LoginInfo
	setParamData.paramData.loginInfo = {};
	setParamData.paramData.loginInfo.reqIdentity	= identity;		// 주민등록번호
	
	// Add Job
	return fn_AddJob("KR", "PP", "0002", "010060", setParamData);
}

// 국민건강보험공단 - 건강검진결과 
function fn_KRPP0002010050(identity) {
	var setParamData = {};
	setParamData.paramData = {};
	
	// LoginInfo
	setParamData.paramData.loginInfo = {};
	setParamData.paramData.loginInfo.reqIdentity	= identity;		// 주민등록번호
	
	// Add Job
	return fn_AddJob("KR", "PP", "0002", "010050", setParamData);
}

// 국민건강보험공단 - 보험료 부과내역
function fn_KRPP0002010070(identity) {
	var setParamData = {};
	setParamData.paramData = {};
	
	// LoginInfo
	setParamData.paramData.loginInfo = {};
	setParamData.paramData.loginInfo.reqIdentity	= identity;		// 주민등록번호
	
	// ParamInfo
	setParamData.paramData.paramInfo = {};
	setParamData.paramData.paramInfo.commStartDate	= "201701";		// 시작일자 YYYYMM
	setParamData.paramData.paramInfo.commEndDate	= "201706";		// 종료일자 YYYYMM
	
	// Add Job
	return fn_AddJob("KR", "PP", "0002", "010070", setParamData);
}

// 국민연금 - 연금산정용 가입내역확인서
function fn_KRPP0001010060(identity) {
	var setParamData = {};
	setParamData.paramData = {};
	
	// LoginInfo
	setParamData.paramData.loginInfo = {};
	setParamData.paramData.loginInfo.reqIdentity	= identity;		// 주민등록번호
	
	// Add Job
	return fn_AddJob("KR", "PP", "0001", "010060", setParamData);
}

// 국민연금 - 연금지급내역 증명서
function fn_KRPP0001010070(identity) {
	var setParamData = {};
	setParamData.paramData = {};
	
	// LoginInfo
	setParamData.paramData.loginInfo = {};
	setParamData.paramData.loginInfo.reqIdentity	= identity;		// 주민등록번호
	
	setParamData.paramData.paramInfo = {};
	// Add Job
	return fn_AddJob("KR", "PP", "0001", "010070", setParamData);
}

//홈택스 - 소득금액증명
function fn_KRNT0001010000() {
	var setParamData = {};
	setParamData.paramData = {};
	
	// LoginInfo
	setParamData.paramData.loginInfo = {};
	
	// ParamInfo
	// TODO 사용 목적에 맞게 수정 필요
	setParamData.paramData.paramInfo = {};
	setParamData.paramData.paramInfo.reqIsIdentityViewYn		= "0";				// 주민번호 뒷자리 공개여부 1:공개, 0:비공개
	setParamData.paramData.paramInfo.reqIsAddrViewYn			= "0";				// 주소공개여부 1:공개, 0:비공개
	setParamData.paramData.paramInfo.reqSearchStartYear		= "2014";		// 시작일자 yyyy (5년 전 ~)
	setParamData.paramData.paramInfo.reqSearchEndYear		= "2016";		// 종료일자 yyyy (7월 1일 이전 : ~2년 전, 7월 1일 이후 : ~전년도)
	setParamData.paramData.paramInfo.reqUsePurposes			= "08";			// 사용용도 01:입찰/계약용, 02:수금용, 03:관공서제출용, 04:대출용, 05:여권또는비자신청용, 06:국민건강보험공단제출용, 07:금융기관제출용, 08:신용카드발급용, 99:기타
	setParamData.paramData.paramInfo.reqSubmitTargets			= "01";			// 제출처 01:금융기관, 02:관공서, 03:조합/협회, 04:거래처, 05:학교, 99:기타
	setParamData.paramData.paramInfo.reqProofType				= "B1001";		// 사용목적(증명구분) B1013:근로소득자용, B1010:연말정산한 사업소득자용, B1001:종합소득세신고자용
	
	// Add Job
	return fn_AddJob("KR", "NT", "0001", "010000", setParamData);
}

// 홈택스 - 부가가치세 면세사업자 수입금액증명
function fn_KRNT0001010050(identity) {
	var setParamData = {};
	setParamData.paramData = {};
	
	// LoginInfo
	setParamData.paramData.loginInfo = {};
	
	// ParamInfo
	// TODO 사용 목적에 맞게 수정 필요
	setParamData.paramData.paramInfo = {};
	if(identity){
		setParamData.paramData.paramInfo.reqIdentity				= identity;	// 사업자번호
	}
	setParamData.paramData.paramInfo.reqIsIdentityViewYn		= "0";			// 주민번호 뒷자리 공개여부 1:공개, 0:비공개
	setParamData.paramData.paramInfo.reqSearchStartYear		= "2015";	// 조회시작년도 yyyy
	setParamData.paramData.paramInfo.reqSearchEndYear		= "2016";	// 조회종료년도 yyyy
	setParamData.paramData.paramInfo.reqUsePurposes			= "08";		// 사용용도 01:입찰/계약용, 02:수금용, 03:관공서제출용, 04:대출용, 05:여권또는비자신청용, 06:국민건강보험공단제출용, 07:금융기관제출용, 08:신용카드발급용, 99:기타
	setParamData.paramData.paramInfo.reqSubmitTargets			= "01";		// 제출처 01:금융기관, 02:관공서, 03:조합/협회, 04:거래처, 05:학교, 99:기타

	// Add Job
	return fn_AddJob("KR", "NT", "0001", "010050", setParamData);
}

// 홈택스 - 사업자등록증명
function fn_KRNT0001010030(identity) {
	var setParamData = {};
	setParamData.paramData = {};
	
	// LoginInfo
	setParamData.paramData.loginInfo = {};
	
	// ParamInfo
	// TODO 사용 목적에 맞게 수정 필요
	setParamData.paramData.paramInfo = {};
	if(identity){
		setParamData.paramData.paramInfo.reqIdentity				= identity;	// 사업자번호 (미입력시 전체)
	}
	setParamData.paramData.paramInfo.reqIsIdentityViewYn		= "0";			// 주민번호 뒷자리 공개여부 1:공개, 0:비공개
	setParamData.paramData.paramInfo.reqIsAddrViewYn			= "1";			// 주소공개여부 1:공개, 0:비공개
	setParamData.paramData.paramInfo.reqUsePurposes			= "08";		// 사용용도 01:입찰/계약용, 02:수금용, 03:관공서제출용, 04:대출용, 05:여권또는비자신청용, 06:국민건강보험공단제출용, 07:금융기관제출용, 08:신용카드발급용, 99:기타
	setParamData.paramData.paramInfo.reqSubmitTargets			= "01";		// 제출처 01:금융기관, 02:관공서, 03:조합/협회, 04:거래처, 05:학교, 99:기타

	// Add Job
	return fn_AddJob("KR", "NT", "0001", "010030", setParamData);
}

// 홈택스 - 부가가치세표준증명
function fn_KRNT0001010040(identity) {
	var setParamData = {};
	setParamData.paramData = {};
	
	// LoginInfo
	setParamData.paramData.loginInfo = {};
	
	// ParamInfo
	// TODO 사용 목적에 맞게 수정 필요
	setParamData.paramData.paramInfo = {};
	if(identity){
		setParamData.paramData.paramInfo.reqIdentity				= identity;		// 사업자번호 (미입력시 전체)
	}
	setParamData.paramData.paramInfo.commStartDate			= "201501";		// 시작일자 yyyyMM (5년전~)
	setParamData.paramData.paramInfo.commEndDate				= "201606";		// 종료일자 yyyyMM (~직전 반기 이전)
	setParamData.paramData.paramInfo.reqIsIdentityViewYn		= "0";				// 주민번호 뒷자리 공개여부 1:공개, 0:비공개
	setParamData.paramData.paramInfo.reqIsAddrViewYn			= "0";				// 주소공개여부 1:공개, 0:비공개
	setParamData.paramData.paramInfo.reqUsePurposes			= "08";			// 사용용도 01:입찰/계약용, 02:수금용, 03:관공서제출용, 04:대출용, 05:여권또는비자신청용, 06:국민건강보험공단제출용, 07:금융기관제출용, 08:신용카드발급용, 99:기타
	setParamData.paramData.paramInfo.reqSubmitTargets			= "01";			// 제출처 01:금융기관, 02:관공서, 03:조합/협회, 04:거래처, 05:학교, 99:기타
	
	// Add Job
	return fn_AddJob("KR", "NT", "0001", "010040", setParamData);
}

function isValidIdentity(identity) {
	// 숫자가 아닌 문자가 포함되어 있거나, 뒷자리 첫번째 숫자가 1~4가 아닌경우 false : 외국인(5, 6)인 경우도 false
	var fmt = /^\d{6}[1234]\d{6}$/;
	if (!fmt.test(identity)) {
		return false;
	}

	// 생년월일 검사 - 앞자리 6자리가 유효한 날짜인지 검사
	var birthYear = (identity.charAt(6) <= "2") ? "19" : "20";
	birthYear += identity.substr(0, 2);
	var birthMonth = identity.substr(2, 2) - 1;
	var birthDate = identity.substr(4, 2);
	var birth = new Date(birthYear, birthMonth, birthDate);

	if (birth.getYear() % 100 != identity.substr(0, 2) || birth.getMonth() != birthMonth || birth.getDate() != birthDate) {
		return false;
	}

	// Check Sum 코드의 유효성 검사
	var buf = new Array(13);
	for (var i = 0; i < 13; i++) {
		buf[i] = parseInt(identity.charAt(i));
	}
	multipliers = [ 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5 ];
	for (var sum = 0, i = 0; i < 12; i++) {
		sum += (buf[i] *= multipliers[i]);
	}
	if ((11 - (sum % 11)) % 10 != buf[12]) {
		return false;
	}

	return true;
}
