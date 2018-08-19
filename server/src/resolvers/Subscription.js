function newCourseSubscribe (parent, args, context, info) {
  return context.db.subscription.course(
    { where: { mutation_in: ['CREATED'] } },
    info,
  )
}

const newCourse = {
  subscribe: newCourseSubscribe
}

function newVoteSubscribe (parent, args, context, info) {
  return context.db.subscription.vote(
    { where: { mutation_in: ['CREATED'] } },
    info,
  )
}

const newVote = {
  subscribe: newVoteSubscribe
}

module.exports = {
  newCourse,
  newVote,
}