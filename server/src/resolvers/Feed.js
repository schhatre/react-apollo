function courses(parent, args, context, info) {
  return context.db.query.courses({ where: { id_in: parent.courseIds } }, info)
}

module.exports = {
  courses,
}