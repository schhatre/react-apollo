async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { url_contains: args.filter },
          { description_contains: args.filter },
        ],
      }
    : {}

  const queriedLinkes = await context.db.query.courses(
    { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
    `{ id }`,
  )

  const countSelectionSet = `
    {
      aggregate {
        count
      }
    }
  `
  const coursesConnection = await context.db.query.coursesConnection({}, countSelectionSet)

  return {
    count: coursesConnection.aggregate.count,
    courseIds: queriedLinkes.map(course => course.id),
  }
}

module.exports = {
  feed,
}
