const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function post(parent, args, context, info) {
  const userId = getUserId(context)
  return context.db.mutation.createCourse(
    {
      data: {
        courseName: args.courseName,
        professorName: args.professorName,
        description: args.description,
        postedBy: { connect: { id: userId } },
      },
    },
    info,
  )
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.db.mutation.createUser({
    data: { ...args, password },
  }, `{ id }`)

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  const user = await context.db.query.user({ where: { email: args.email } }, `{ id password }`)
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  }
}

async function vote(parent, args, context, info) {
  const userId = getUserId(context)
  const courseExists = await context.db.exists.Vote({
    user: { id: userId },
    course: { id: args.courseId },
  })
  if (courseExists) {
    throw new Error(`Already voted for course: ${args.courseId}`)
  }

  return context.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        course: { connect: { id: args.courseId } },
      },
    },
    info,
  )
}

module.exports = {
  post,
  signup,
  login,
  vote
}
