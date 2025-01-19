import {createElement} from 'react'
import ReactDOM from 'react-dom';
import Button from '@atlaskit/button';
import {fetchIssueById} from './api.mjs'

function run() {
        observeAndAttachCopyButton()
}

function observeAndAttachCopyButton() {
        const observer = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                        attachCopyButtonToDetailPage()
                        attachCopyButtonToDropdownList()
                });
        });
        observer.observe(document.body, {childList: true, subtree: true})
}

function attachCopyButtonToDetailPage() {
        const taskDetailPageButtonListClassName = '_otyr1b66 _1e0c116y'
        const copyButtonId = 'detail-page-copy-btn'
        const buttonList = document.getElementsByClassName(taskDetailPageButtonListClassName)[0]
        if(buttonList) {
                if(!document.getElementById(copyButtonId)) {
                        const buttonWrapper = document.createElement('div');
                        buttonWrapper.id = 'jira-utils';
                        buttonWrapper.style = 'margin-left: 8px;'
                        buttonList.appendChild(buttonWrapper);
                        const copyBtn = createElement(Button, { onClick: () => copyTask(getIssueId())}, 'Copy');
                        ReactDOM.render(copyBtn, buttonWrapper);
                }
        }
}

function attachCopyButtonToDropdownList() {
        const copyButtonId = 'dropdown-list-copy-btn'
        const list = document.getElementsByClassName(copyButtonId)[0]
        if(list) {
                if(!document.getElementById('jira-utils-1')) {
                        const ul = list.getElementsByClassName('css-38wpj8')[0]
                        if(!ul || ul.children.length === 0) {
                                return;
                        }

                        const nativeLi = ul.children[ul.children.length - 1]
                        if(!nativeLi.className.includes(copyButtonId)) {
                                const card = ul.closest('.sc-1tdshev-0.fRXtMT') // backlog task
                                        ?? ul.closest('._kqswstnw._1bsb1osq')  // backlog subtask
                                        ?? ul.closest('._1e0c1ule._kqswh2mm._1pby1wug')  // sprint task
                                if(!card)  {
                                        return;
                                }
                                
                                const taskIdComponent = card.querySelector('a.sc-8u98g6-0.hthrAf')  // backlog (crosslined)
                                        ?? card.querySelector('a.sc-8u98g6-0.fdiMTp')  // backlog task,subtask (plain)
                                        ?? card.querySelector('a._uizt1wug') // sprint task
                                if(!taskIdComponent) {
                                        return;
                                }
                                
                                const id = taskIdComponent.childNodes[0].textContent

                                const copied = nativeLi.cloneNode(true)
                                copied.className += ' ' + copyButtonId
                                
                                const button = copied.getElementsByTagName('button')[0]
                                if (button) {
                                        button.onclick = async () => {
                                                await copyTask(id);
                                                document.body.dispatchEvent( new MouseEvent('mousedown', {
                                                        bubbles: true,
                                                        cancelable: true,
                                                        view: window
                                                }));
                                        }
                                }

                                const span = copied.getElementsByTagName('span')[0]
                                if (span) {
                                        span.innerText = 'Copy (Jira Assistant)'
                                }

                                ul.appendChild(copied);
                        }
                }
        }
}



function getIssueId() {
        const url = new URL(window.location.href)
        return url.searchParams.get('selectedIssue') ?? url.pathname.split('/').pop()
}

function getUrlByIssueId(id) {
        return `${window.location.origin}/browse/${id}`
}


async function copyTask(issueId) {
        document.body.focus()
        const issue = await fetchIssueById(issueId)
        const clipboardItem = new ClipboardItem({
                'text/plain': new Blob([`${issue.id} ${issue.title}`], {type: 'text/plain'}),
                'text/html': new Blob([`<a href="${getUrlByIssueId(issue.id)}">${issue.id}</a> ${issue.title}`], {type: 'text/html'})
        })
        
        await navigator.clipboard.write([clipboardItem])
}


run();
