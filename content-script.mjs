import {createElement} from 'react'
import ReactDOM from 'react-dom';
import Button from '@atlaskit/button';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import {fetchIssueById} from './api.mjs'

function run() {
        observeAndAttachCopyButton()
}

function observeAndAttachCopyButton() {
        const observer = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                        attachCopyButtonToDetailPage()
                        attackCopyButtonToDropdownList()
                });
        });
        observer.observe(document.body, {childList: true, subtree: true})
}

function attachCopyButtonToDetailPage() {
        const buttonList = document.getElementsByClassName('_otyr1b66 _1yt4swc3 _1e0c116y')[0]
        if(buttonList) {
                if(!document.getElementById('jira-utils')) {
                        const buttonWrapper = document.createElement('div');
                        buttonWrapper.id = 'jira-utils';
                        buttonWrapper.style = 'margin-left: 8px;'
                        buttonList.appendChild(buttonWrapper);
                        const copyBtn = createElement(Button, { onClick: () => copyTask(getIssueId())}, 'Copy');
                        ReactDOM.render(copyBtn, buttonWrapper);
                }
        }
}

function attackCopyButtonToDropdownList() {
        const list = document.getElementsByClassName('_1ul9uuw1 _c71ldgin')[0]
        if(list) {
                if(!document.getElementById('jira-utils-1')) {
                        const ul = list.getElementsByClassName('css-1t463rh')[0]
                        if(!ul || ul.children.length === 0) {
                                return;
                        }

                        const nativeLi = ul.children[ul.children.length - 1]
                        if(!nativeLi.className.includes('jira-utils-1')) {
                                const card = ul.closest('.sc-1tdshev-0.fRXtMT') // backlog task
                                        ?? ul.closest('._kqswstnw._1bsb1osq')  // backlog subtask
                                        ?? ul.closest('._1e0c1ule._kqswh2mm._1pby1wug')  // sprint task
                                if(!card)  {
                                        return;
                                }
                                
                                const taskIdComponent = card.querySelector('a.sc-8u98g6-0.hthrAf')  // backlog (crosslined)
                                        ?? card.querySelector('a.sc-8u98g6-0.fdiMTp')  // backlog task,subtask (plain)
                                        ?? card.querySelector('span._1e0c1ule._1reo15vq') // sprint task
                                if(!taskIdComponent) {
                                        return;
                                }
                                
                                const id = taskIdComponent.childNodes[0].textContent

                                const copied = nativeLi.cloneNode(true)
                                copied.className += ' jira-utils-1';
                                
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
