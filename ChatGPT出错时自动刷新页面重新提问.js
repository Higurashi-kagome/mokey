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
            const id = setInterval(() => {
                // 等待出现对话
                const mask = document.getElementsByClassName("rounded-sm")
                if(!mask?.length) return
                // 等待出现输入框或“重新提问”按钮
                const input = document.querySelector('textarea')
                const reopen = document.querySelector('.btn.relative.btn-primary.m-auto')
                if(!reopen && !input ) return
                if(reopen && reopen.textContent.indexOf('Regenerate') > -1) {
                    reopen.click()
                } else if (input) {
                    input.value = value
                    const btn = input.parentElement.querySelector('button')
                    btn.disabled = false
                    btn.click()
                } else return
                clearInterval(id)
                GM_setValue(key, '')
            }, 1000);
        }
        const id = setInterval(() => {
            // 灰色 div 容器（ChatGPT 回复）
            let gray = document.querySelectorAll('div.bg-gray-50')
            let last = gray[gray.length-1]
            // 错误
            let err = last?.querySelector('.border-red-500')
            if(err) {
                // 最后的提问
                let question = last.previousSibling.querySelector('.flex-grow.gap-3').textContent
                if(question.length > 1000){
                    console.error('问题过长')
                    question = ''
                }
                GM_setValue(key, question)
                clearInterval(id)
                location.reload()
            }
        }, 500);
    }
})();