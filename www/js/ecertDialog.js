var ecertDialog = {

    _certDialog: null, //ui dialog

    _listener: {},

    _certItems: [], //인증서 리스트

    // below ie7 needs json2.js.
    _certPIDS: JSON.parse('{"1.2.410.200004.2.1":{"usetype":"공인인증기관", "organization":"공인인증기관"},"2.5.29.32.0":{"usetype":"공인인증기관", "organization":"공인인증기관"},"1.2.410.100001.2.2.1":{"usetype":"공인인증기관","organization":"공인인증기관"},"1.2.410.100001.2.1.1,1.2.410.100001.2.1.2":{"usetype":"공인인증기관", "organization":"공인인증기관"},"1.2.410.100001.2.1.1,1.2.410.100001.2.1.2,1.2.410.100001.2.2.1":{"usetype":"공인인증기관", "organization":"공인인증기관"},"1.2.410.200005.1.1.1":{"usetype":"범용개인", "organization":"금융결제원"},"1.2.410.200005.1.1.2":{"usetype":"은행기업", "organization":"금융결제원"},"1.2.410.200005.1.1.4":{"usetype":"은행개인", "organization":"금융결제원"},"1.2.410.200005.1.1.5":{"usetype":"범용기업", "organization":"금융결제원"},"1.2.410.200005.1.1.6":{"usetype":"용도제한용", "organization":"금융결제원"},"1.2.410.200005.1.1.6.1":{"usetype":"기업뱅킹", "organization":"금융결제원"},"1.2.410.200005.1.1.6.2":{"usetype":"신용카드", "organization":"금융결제원"},"1.2.410.200004.5.1.1.1":{"usetype":"스페셜 개인", "organization":"코스콤"},"1.2.410.200004.5.1.1.2":{"usetype":"스페셜 개인서버", "organization":"코스콤"},"1.2.410.200004.5.1.1.3":{"usetype":"스페셜 법인", "organization":"코스콤"},"1.2.410.200004.5.1.1.4":{"usetype":"스페셜 서버", "organization":"코스콤"},"1.2.410.200004.5.1.1.5":{"usetype":"범용개인", "organization":"코스콤"},"1.2.410.200004.5.1.1.6":{"usetype":"범용 개인서버", "organization":"코스콤"},"1.2.410.200004.5.1.1.7":{"usetype":"범용기업", "organization":"코스콤"},"1.2.410.200004.5.1.1.8":{"usetype":"범용 서버", "organization":"코스콤"},"1.2.410.200004.5.1.1.9":{"usetype":"증권/보험용", "organization":"코스콤"},"1.2.410.200004.5.1.1.9.2":{"usetype":"신용카드", "organization":"코스콤"},"1.2.410.200004.5.1.1.10":{"usetype":"골드 개인서버", "organization":"코스콤"},"1.2.410.200004.5.1.1.11":{"usetype":"실버 개인", "organization":"코스콤"},"1.2.410.200004.5.1.1.12":{"usetype":"실버 법인", "organization":"코스콤"},"1.2.410.200004.2.1,1.2.410.200012.1.1.1":{"usetype":"전자거래 서명용(개인)", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.2":{"usetype":"전자거래 암호용(개인)", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.3":{"usetype":"전자거래 서명용(법인)", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.4":{"usetype":"전자거래 암호용(법인)", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.5":{"usetype":"전자거래 서명용(서버)", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.6":{"usetype":"전자거래 암호용(서버)", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.7":{"usetype":"전자무역 서명용(개인)", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.8":{"usetype":"전자무역 암호용(개인)", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.9":{"usetype":"전자무역 서명용(법인)", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.10":{"usetype":"전자무역 암호용(법인)", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.11":{"usetype":"전자무역 서명용(서버)", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.12":{"usetype":"전자무역 암호용(서버)", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.101":{"usetype":"은행/보험용", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.103":{"usetype":"증권/보험용", "organization":"한국무역정보통신"},"1.2.410.200004.2.1,1.2.410.200012.1.1.105":{"usetype":"신용카드용", "organization":"한국무역정보통신"},"1.2.410.200004.5.4.1.1":{"usetype":"범용개인", "organization":"한국 전자인증"},"1.2.410.200004.5.4.1.2":{"usetype":"범용기업", "organization":"한국 전자인증"},"1.2.410.200004.5.4.1.3":{"usetype":"범용(서버)", "organization":"한국 전자인증"},"1.2.410.200004.5.4.1.4":{"usetype":"특수목적용(개인)", "organization":"한국 전자인증"},"1.2.410.200004.5.4.1.5":{"usetype":"특수목적용(법인)", "organization":"한국 전자인증"},"1.2.410.200004.5.4.1.101":{"usetype":"은행개인", "organization":"한국 전자인증"},"1.2.410.200004.5.4.1.102":{"usetype":"증권거래용", "organization":"한국 전자인증"},"1.2.410.200004.5.4.1.103":{"usetype":"신용카드", "organization":"한국 전자인증"},"1.2.410.200004.5.4.1.104":{"usetype":"전자민원용", "organization":"한국 전자인증"},"1.2.410.200004.5.2.1.1":{"usetype":"범용기업", "organization":"정보인증"},"1.2.410.200004.5.2.1.2":{"usetype":"범용개인", "organization":"정보인증"},"1.2.410.200004.5.2.1.3":{"usetype":"특별등급(전자입찰)", "organization":"정보인증"},"1.2.410.200004.5.2.1.4":{"usetype":"1등급인증서(서버)", "organization":"정보인증"},"1.2.410.200004.5.2.1.5":{"usetype":"특별등급 법인", "organization":"정보인증"},"1.2.410.200004.5.2.1.7.1":{"usetype":"은행개인", "organization":"정보인증"},"1.2.410.200004.5.2.1.7.2":{"usetype":"증권/보험용", "organization":"정보인증"},"1.2.410.200004.5.2.1.7.3":{"usetype":"신용카드", "organization":"정보인증"},"1.2.410.200004.5.3.1.1":{"usetype":"범용기업", "organization":"한국전산원"},"1.2.410.200004.5.3.1.2":{"usetype":"범용기업", "organization":"한국전산원"},"1.2.410.200004.5.3.1.3":{"usetype":"1등급(서버)", "organization":"한국전산원"},"1.2.410.200004.5.3.1.5":{"usetype":"특수목적용(기관/단체)", "organization":"한국전산원"},"1.2.410.200004.5.3.1.6":{"usetype":"특수목적용(법인)", "organization":"한국전산원"},"1.2.410.200004.5.3.1.7":{"usetype":"특수목적용(서버)", "organization":"한국전산원"},"1.2.410.200004.5.3.1.8":{"usetype":"특수목적용(개인)", "organization":"한국전산원"},"1.2.410.200004.5.3.1.9":{"usetype":"범용개인", "organization":"한국전산원"},"1.2.410.200012.1.1.1":{"usetype":"범용개인", "organization":"한국무역정보통신"},"1.2.410.200012.1.1.3":{"usetype":"범용기업", "organization":"한국무역정보통신"},"1.2.410.200012.1.1.101":{"usetype":"은행개인", "organization":"한국무역정보통신"},"1.2.410.200012.1.1.105":{"usetype":"신용카드", "organization":"한국무역정보통신"}}'),

    _headElement: ["구분", "사용자", "만료일", "발급자"],

    _subjectOUNames: [{subjectOU: "ou=산업은행", dspName: "KDB"}, {subjectOU: "ou=IBK", dspName: "기업은행"}, {subjectOU: "ou=KMB", dspName: "국민은행"}, {subjectOU: "ou=CHB", dspName: "조흥은행"}, {subjectOU: "ou=KFTC", dspName: "금융결제원"}, {subjectOU: "ou=KEB", dspName: "외환은행"}, {subjectOU: "ou=NFFC", dspName: "수협은행"}, {subjectOU: "ou=NACF", dspName: "농협은행"}, {subjectOU: "ou=WOORI", dspName: "우리은행"}, {subjectOU: "ou=KFB", dspName: "제일은행"}, {subjectOU: "ou=SHB", dspName: "신한은행"}, {subjectOU: "ou=KAB", dspName: "한미은행"}, {subjectOU: "ou=DGB", dspName: "대구은행"}, {subjectOU: "ou=PSB", dspName: "부산은행"}, {subjectOU: "ou=KJB", dspName: "광주은행"}, {subjectOU: "ou=CJB", dspName: "제주은행"}, {subjectOU: "ou=JBB", dspName: "전북은행"}, {subjectOU: "ou=KNBBANK", dspName: "경남은행"}, {subjectOU: "ou=KFCC", dspName: "새마을금고"}, {subjectOU: "ou=SEOULBANK", dspName: "서울은행"}, {subjectOU: "ou=CUBANK", dspName: "신협"}, {subjectOU: "ou=CITI", dspName: "씨티은행"}, {subjectOU: "ou=HSBC", dspName: "홍콩상하이은행"}, {
        subjectOU: "ou=DEUT",
        dspName: "도이치뱅크"
    }, {subjectOU: "ou=BANA", dspName: "BankofAmerica"}, {subjectOU: "ou=HNB", dspName: "하나은행"}],

    usbItems: [],

    externalInput: false,

    certShowGbn: false,

    minLength: 5,

    maxLength: 20,

    _getUsetype: function (o) {
        var ss = "알수없음";
        var data = this._certPIDS[o];
        if (typeof data === "object") {
            if (typeof data.usetype != "undefined")
                return data.usetype;
        }
        return ss;
    },

    _getOrganization: function (o) {
        var ss = "알수없음";
        var data = this._certPIDS[o];
        if (typeof data === "object") {
            if (typeof data.organization != "undefined")
                return data.organization;
        }
        return ss;
    },

    _convertTime: function (a) {
        var newDate = new Date((new Date(a * 1000)));
        var month = (newDate.getMonth() + 1);
        var day = newDate.getDate();

        return newDate.getFullYear() + '-' + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
    },

    displayCert: function (certifications) {
        this._certItems = typeof (certifications) == "object" ? certifications : [];

        var html = "";
        $("#listCert").html("");

        var date = new Date();
        var nowDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000;

        $.each(this._certItems, function (idx, certItem) {

            html = `<tr tabindex="0">
                        <td class="text-center"><i class="ico-cert"></i>${ecertDialog._getUsetype(certItem["cert.extension.policyid"])}</td>
                        <td><div class="ellipsis">${certItem["cert.subjectname.CN"]} </div></td>
                        <td class="text-center">${ecertDialog._convertTime(certItem["cert.validity.notAfter"])}</td>
                        <td class="text-center">${ecertDialog._getOrganization(certItem["cert.extension.policyid"])}</td>
                    </tr>`

            if (!ecertDialog.certShowGbn) {		//만료인증서인경우 표시안함 (인증서 만료 노출 처리(true : 표시, false : 미표시))
                if (!(nowDate > certItem["cert.validity.notAfter"])) {			//인증서 기간비교
                    $("#listCert").append(html);
                }
            } else {
                $("#listCert").append(html);
            }
        });

        // 인증서 리스트 선택
        $('#table-certlist tr').on('click keypress', function () {
            $(this).addClass('selected').siblings().removeClass('selected');
        });
    },

    displayExtdrive: function (drivers) {
        this.usbItems = typeof (drivers) == "object" ? drivers : [];
        drivers;

        var html = "";
        var i = 0
        $.each(this.usbItems, function (idx, usbItem) {
            if (usbItem != "") {
                html += '<li tabindex="0">' + usbItem + "</li>";
            }
        });

        $("#listUSB").html(html);

        // selected ext drive select
        $('.usb-list').find('li').on('click keypress', function () {
            // 이벤트처리
            $(this).parent().hide();

            var driver = $(this).tabs(0).text();
            if (typeof driver === "string") {
                ecertDialog._callReturnFunction("OnLoadCertification", driver);
            }

        });

        $('.usb-list').fadeIn(100);
    },

    addListner: function (name, fcall_back) {
        if (name && fcall_back && (typeof name === "string") && (typeof fcall_back === "function")) {
            this._listener[name] = fcall_back;
        }
    },

    _confirmButton: function (e) {

        var bValide = false;
        var password = null;
        if (ecertDialog.externalInput) {
            bValide = ecertDialog._callReturnFunction("OnPassValidate");
        } else {
            var err = "";
            var passwordobj = $("#certPassword");

            if (passwordobj) {
                password = passwordobj.val();
            }

            if (typeof password != "string") {
                ecertDialog._callReturnFunction("OnPassValidate", ecertDialog.externalInput, "E10001");
                return;
            }

            if (password.length < ecertDialog.minLength) {
                ecertDialog._callReturnFunction("OnPassValidate", ecertDialog.externalInput, "E10002");
                return;
            }

            bValide = true;
        }

        //OnConfirmClick
        if (bValide) {
            var index = $("#listCert .selected");
            if (ecertDialog.externalInput) {
                var passwordobj = $("#certPassword");
            }

            if (index) {
                ecertDialog._callReturnFunction("OnConfirmClick", ecertDialog._certItems[index], password);

                ecertDialog.closeDialog();
            } else {
                ecertDialog._callReturnFunction("OnPassValidate", ecertDialog.externalInput, "E10003");
            }
        }
    },

    _cancelButton: function () {
        ecertDialog._callReturnFunction("OnCancelClick");

        ecertDialog.closeDialog();
    },

    _callReturnFunction: function () {
        var ret = null;

        if (arguments.length > 0) {
            var fnname = arguments[0];
            if (typeof fnname === "string") {
                var fn = ecertDialog._listener[arguments[0]];
                if (fn && (typeof fn === "function")) {
                    var data = [];
                    if (arguments.length > 1) {
                        for (var i = 1; i < arguments.length; i++) {
                            data[i - 1] = arguments[i];
                        }
                        ret = fn.apply(null, data);
                    } else {
                        ret = fn();
                    }
                }
            }
        }
        return ret;
    },

    _createCertSelect: function () {
        var select = document.createElement("div");

        const content = `<div class="cert-select" role="tablist">
                            <a tabindex="0" id="harddisk" role="tab" aria-controls="table-certlist"><img src="images/tab_harddisk_on.png" alt="하드디스크"></a>
                            <a tabindex="0" id="usb" role="tab" aria-controls="listUSB" style="margin-left: 12px;"><img src="images/tab_usb.png" alt="이동식디스크"></a>
                            <ul id="listUSB" role="tabpanel" aria-labelledby="usb" class="usb-list" style="display: none;"></ul>
                        </div>`

        select.innerHTML = content;
        return select;
    },

    _createCertList: function () {
        var list = document.createElement("div");

        const content = `<div class="cert-list">
                            <table class="table-bordered" id="table-certlist" role="tabpanel" aria-labelledby="harddisk">
                                <thead>
                                    <tr>
                                        <th>구분</th><th>사용자</th><th>만료일</th><th>발급자</th>
                                    </tr>
                                </thead>
                                <tbody id="listCert"></tbody>
                            </table>
                        </div>`

        list.innerHTML = content;

        return list;
    },

    _createCertPassword: function () {
        var certpass = document.createElement("div");
        certpass.setAttribute("class", "form-cert-password");

        var pele = document.createElement("p");
        pele.innerText = "인증서 암호는 대소문자를 구분합니다.";

        certpass.appendChild(pele);

        var certpassele = document.createElement("div");
        certpassele.setAttribute("class", "password-wrapper");

        //label
        var certpassLabel = document.createElement("label");
        certpassLabel.setAttribute("for", "certPassword");
        certpassLabel.innerText = "인증서암호";

        certpassele.appendChild(certpassLabel);

        //input box call back assigne
        if (this.externalInput) {
            ecertDialog._callReturnFunction("OnCreatePassword", certpassele);
        } else {
            //input
            var certpassInput = document.createElement("input");
            certpassInput.setAttribute("type", "password");
            certpassInput.setAttribute("id", "certPassword");
            certpassInput.setAttribute("maxlength", this.maxLength);
            certpassele.appendChild(certpassInput);
        }

        certpass.appendChild(certpassele);

        return certpass;

    },

    _createDialog: function () {
        if (!this._certDialog) {
            this._certDialog = document.createElement("div");
            this._certDialog.setAttribute("id", "ecertDialog");
            this._certDialog.title = "인증서 선택";

            //create title
            var h2 = document.createElement("h2");
            h2.innerText = "인증서 위치";
            this._certDialog.appendChild(h2);


            //select disk and external disk
            this._certDialog.appendChild(this._createCertSelect());

            //cert-list create
            this._certDialog.appendChild(this._createCertList());

            //input password setting
            this._certDialog.appendChild(this._createCertPassword());

            //append body
            document.body.appendChild(this._certDialog);

            $("#ecertDialog").dialog({
                autoOpen: false,
                width: 550,
                height: 630,
                modal: true,
                buttons: {
                    '확인': ecertDialog._confirmButton,
                    '취소': ecertDialog._cancelButton
                },
                close: function (event, ui) {
                    ecertDialog._cancelButton();
//				    ecertDialog.closeDialog();
                }
            });

            $('.cert-select a').on('click keypress', function () {
                const isUSB = this.id === 'usb';

                if (isUSB) {
                    ecertDialog._callReturnFunction("OnLoadExtraDrive");
                } else {
                    ecertDialog._callReturnFunction("OnLoadCertification", "");
                    $('.usb-list').fadeOut(100);
                }

                const check = this.childNodes[0].src.match('_on.');
                if (check) return;
                $('.cert-select img').each(function () {
                    var off = this.src.replace('_on.png', '.png');
                    var on = this.src.replace('.png', '_on.png');
                    $(this).attr('src', this.src.match('_on.') ? off : on);
                });
            });

            $('#certPassword').on('change', function () {
                // 이벤트처리
            });
        } else {
            $("#harddisk").click();			//dialog device default harddisk
            $("#certPassword").val("");		//password 초기화
        }
    },

    showDialog: function (callback) {
        this._createDialog();

        //OnShow
        ecertDialog._callReturnFunction("OnShow");

        //init first hard disk certification load
        ecertDialog._callReturnFunction("OnLoadCertification", "");

        //dialog open
        $("#ecertDialog").dialog("open");
    },

    closeDialog: function (removeTag) {
        //dialog close
        $("#ecertDialog").dialog("close");

        //close event call
        ecertDialog._callReturnFunction("OnClose");

        if (removeTag) {
            $("#ecertDialog").remove();
        }
    }

}




