import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const VOTE_MUTATION = gql`
  mutation VoteMutation($courseId: ID!) {
    vote(courseId: $courseId) {
      id
      course {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

class Link extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)

    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
          {authToken && (
            <Mutation
              mutation={VOTE_MUTATION}
              variables={{ courseId: this.props.course.id }}
              update={(store, { data: { vote } }) =>
                this.props.updateStoreAfterVote(store, vote, this.props.course.id)
              }
            >
              {voteMutation => (
                <div className="ml1 gray f11" onClick={voteMutation}>
                  ▲
                </div>
              )}
            </Mutation>
          )}
        </div>
        <div className="ml1">
          <div>
            {this.props.course.description} ({this.props.course.courseName})
          </div>
          <div>
            {this.props.course.professorName} 
          </div>
          <div className="f6 lh-copy gray">
            {this.props.course.votes.length} votes | by{' '}
            {this.props.course.postedBy
              ? this.props.course.postedBy.name
              : 'Unknown'}{' '}
            {timeDifferenceForDate(this.props.course.createdAt)}
          </div>
        </div>
      </div>
    )
  }
}

export default Link