import {createElement} from 'react'
import ReactDOM from 'react-dom';
import Button from '@atlaskit/button';
import {fetchIssueById} from './api.mjs'

function getIssueId() {
        const url = new URL(window.location.href)
        console.log(url,url.searchParams.get('selectedIssue') , url.pathname.split('/').pop())
        return url.searchParams.get('selectedIssue') ?? url.pathname.split('/').pop()
}

function getUrlByIssueId(id) {
        return `${window.location.origin}/browse/${id}`
}

async function copyTask(issueId) {
        const issue = await fetchIssueById(issueId)
        const clipboardItem = new ClipboardItem({
                'text/plain': new Blob([`${issue.id} ${issue.title}`], {type: 'text/plain'}),
                'text/html': new Blob([`<a href="${getUrlByIssueId(issue.id)}">${issue.id}</a> ${issue.title}`], {type: 'text/html'})
        })
        navigator.clipboard.write([clipboardItem])
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
        const buttonList = document.getElementsByClassName('_otyr1b66 _1yt4swc3 _1e0c116y')[0]
        if(buttonList) {
                if(!document.getElementById('jira-utils')) {
                        const buttonWrapper = document.createElement('div')
                        buttonWrapper.id = 'jira-utils';
                        buttonList.appendChild(buttonWrapper);

                        const copyBtn = createElement(Button, { onClick: () => copyTask(getIssueId()) }, 'Copy');
                        ReactDOM.render(copyBtn, buttonWrapper);
                }

        }
    });
});

function initialize() {
        observer.observe(document.body, {childList: true, subtree: true})
}

initialize()
