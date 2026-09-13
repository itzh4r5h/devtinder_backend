export const profileCompletion = (user) => {
  console.log(user)
  const profileFields = [
    'username',
    'name',
    'email',
    'profilePic',
    'role',
    'experience',
    'connections',
    'age',
    'gender',
    'description',
    'tags',
  ]
  const isCompleted = (value) => {
    if (value === undefined || value === null) return false;

    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    // here it checks for the tags
    if (typeof value === 'array') {
      return value.length > 0
    }
    // here it checks the profilePic url
    if (typeof value === 'object') {
      return value?.url !== 'none'
    }

    return true;
  };
  const completedFields = profileFields.filter((field) => isCompleted(user[field])).length
  const result = completedFields / profileFields.length
  const profileCompletionCount = Math.round(result * 100)
  const isProfileCompleted = profileCompletionCount === 100 ? true : false
  return { profileCompletionCount, isProfileCompleted }
}
