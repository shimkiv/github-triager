import {Octokit} from '@octokit/core'
import {paginateRest} from '@octokit/plugin-paginate-rest'
import dotenv from 'dotenv'
import {Label} from './Model'

dotenv.config()

const stale = 'stale'
const triage = 'triage'

let _toBeClosed = 0

const gitHubTargetOwner = process.env.GIT_HUB_TARGET_OWNER || ''
const gitHubTargetRepo = process.env.GIT_HUB_TARGET_REPO || ''
const gitHubApiToken = process.env.GIT_HUB_ACCESS_TOKEN || ''

const _Octokit = Octokit.plugin(paginateRest)
const octokit = new _Octokit({auth: gitHubApiToken})

const skipUserList = new Array<string>('figitaki', 'emberian', 'enolan', '0x0I')

for await (const response of octokit.paginate.iterator('GET /repos/{owner}/{repo}/issues', {
  owner: gitHubTargetOwner,
  repo: gitHubTargetRepo,
})) {
  for (const issue of response.data) {
    if (issue.state === 'open') {
      const labelObjects: Array<Label> = JSON.parse(JSON.stringify(issue.labels))
      const labels = labelObjects.map((label) => label.name)

      if (labels.includes(stale) && labels.includes(triage)) {
        if (!skipUserList.includes(issue.user!.login)) {
          await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
            owner: gitHubTargetOwner,
            repo: gitHubTargetRepo,
            issue_number: issue.number,
            body: 'Closing this issue as it is `stale` for a long time.',
          })

          await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
            owner: gitHubTargetOwner,
            repo: gitHubTargetRepo,
            issue_number: issue.number,
            state: 'closed',
          })

          _toBeClosed++
        }
      }
    }
  }
}

console.log('')
console.log('==================================================')
console.log('=================== COMPLETED ====================')
console.log('==================================================')
console.log('')
console.log(`Total Issues To Be Closed: ${_toBeClosed}`)
console.log('')
console.log('==================================================')
console.log('')
