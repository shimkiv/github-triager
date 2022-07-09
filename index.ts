import {Octokit} from '@octokit/core'
import {paginateRest} from '@octokit/plugin-paginate-rest'
import dotenv from 'dotenv'

dotenv.config()

interface Label {
  id: number | undefined
  node_id: string | undefined
  url: string | undefined
  name: string | undefined
  description: string | null | undefined
  color: string | null | undefined
  default: boolean | undefined
}

// The following labels should be created within the target GitHub repository
const backlog = 'backlog'
const triage = 'triage'

const gitHubTargetOrgs = process.env.GIT_HUB_TARGET_ORGS?.split(',') || []
const gitHubTargetOwner = process.env.GIT_HUB_TARGET_OWNER || ''
const gitHubTargetRepo = process.env.GIT_HUB_TARGET_REPO || ''
const gitHubApiToken = process.env.GIT_HUB_ACCESS_TOKEN || ''

const _Octokit = Octokit.plugin(paginateRest)
const octokit = new _Octokit({auth: gitHubApiToken})

const getOwners = async (): Promise<Set<string>> => {
  const ownerSet = new Set<string>()

  for (const org of gitHubTargetOrgs) {
    const teams = await octokit.request('GET /orgs/{org}/teams', {
      org,
    })

    for (const team of teams.data) {
      const teamMembers = await octokit.request('GET /orgs/{org}/teams/{team_slug}/members', {
        org,
        team_slug: team.slug,
      })

      for (const member of teamMembers.data) {
        ownerSet.add(member.login)
      }
    }
  }

  return ownerSet
}

let _totalCounter = 0
let _triageCounter = 0
let _backlogCounter = 0
const owners = Array.from((await getOwners()).values())

for await (const response of octokit.paginate.iterator('GET /repos/{owner}/{repo}/issues', {
  owner: gitHubTargetOwner,
  repo: gitHubTargetRepo,
})) {
  for (const issue of response.data) {
    if (
      issue.state === 'open' &&
      (issue.assignee === null || issue.assignee === undefined) &&
      (issue.pull_request === null || issue.pull_request === undefined)
    ) {
      const triageLabel = owners.includes(issue.user!.login) ? backlog : triage
      const labelObjects: Array<Label> = JSON.parse(JSON.stringify(issue.labels))
      const labels = labelObjects.map((label) => label.name)

      if (!labels.includes(triageLabel)) {
        owners.includes(issue.user!.login) ? _backlogCounter++ : _triageCounter++

        // TODO: Uncomment once discussed with the team.
        // await octokit.request('PUT /repos/{owner}/{repo}/issues/{issue_number}/labels', {
        //   owner: gitHubTargetOwner,
        //   repo: gitHubTargetRepo,
        //   issue_number: issue.number,
        //   labels: [triageLabel],
        // })
      }
    }
  }

  _totalCounter += response.data.length
}

console.log('')
console.log('==================================================')
console.log('=================== COMPLETED ====================')
console.log('==================================================')
console.log('')
console.log(`Total Issues Processed: ${_totalCounter}`)
console.log(`>> Goes To Backlog:     ${_backlogCounter}`)
console.log(`>> To Be Triaged:       ${_triageCounter}`)
console.log(`>> No Action Required:  ${_totalCounter - (_backlogCounter + _triageCounter)}`)
console.log('')
console.log('==================================================')
console.log('')
