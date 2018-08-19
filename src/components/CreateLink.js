import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $courseName: String!, $professorName: String) {
    post(description: $description, courseName: $courseName, professorName :$professorName) {
      id
      createdAt
      courseName
      professorName
      description
    }
  }
`

class CreateLink extends Component {
  state = {
    description: '',
    courseName: '',
    professorName:''
  }

  render() {
    const { description, courseName, professorName } = this.state
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={courseName}
            onChange={e => this.setState({ courseName: e.target.value })}
            type="text"
            placeholder="The Name for the course"
          />
          <input
            className="mb2"
            value={professorName}
            onChange={e => this.setState({ professorName: e.target.value })}
            type="text"
            placeholder="The Name for the Professor"
          />
          <input
            className="mb2"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the course"
          />
        </div>
        <Mutation
          mutation={POST_MUTATION}
          variables={{ description, courseName, professorName }}
          onCompleted={() => this.props.history.push('/new/1')}
          update={(store, { data: { post } }) => {
            const first = LINKS_PER_PAGE
            const skip = 0
            const orderBy = 'createdAt_DESC'
            const data = store.readQuery({
              query: FEED_QUERY,
              variables: { first, skip, orderBy },
            })
            data.feed.courses.unshift(post)
            store.writeQuery({
              query: FEED_QUERY,
              data,
              variables: { first, skip, orderBy },
            })
          }}
        >
          {postMutation => <button onClick={postMutation}>Submit</button>}
        </Mutation>
      </div>
    )
  }
}

export default CreateLink
