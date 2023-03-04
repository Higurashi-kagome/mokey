// ==UserScript==
// @name         ChatGPT 出错时自动刷新页面重新提问
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ChatGPT 出错时自动刷新页面重新提问
// @author       Hao Liu
// @match        https://chat.openai.com/chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
// ChatGPT 出错时自动刷新页面重新提问
(function() {
    'use strict';
    let key = "ChatGPT_question2"
    window.onload = ()=>{
        let value = GM_getValue(key, '')
        console.log(value)
        if(value){
            let id = setInterval(() => {
                let input = document.querySelector('textarea')
                let mask = document.getElementsByClassName("rounded-sm")
                if(!input || !mask?.length) return
                input.value = value
                input.parentElement.querySelector('button').click()
                GM_setValue(key, '')
                clearInterval(id)
            }, 500);
        }
    }
    setInterval(() => {
        let el = document.getElementsByClassName('border-red-500')
        if(el?.length) {
            // 灰色 div 容器（ChatGPT 回复）
            let gray = document.querySelectorAll('div.bg-gray-50')
            let last = gray[gray.length-1]
            let question = ''
            if(last.textContent.indexOf('An error occurred') > -1) {
                question = last.previousSibling.textContent
            }
            if(question.length > 1000){
                console.error('问题过长')
                question = ''
            }
            GM_setValue(key, question)
            location.reload()
        }
    }, 500);
})();