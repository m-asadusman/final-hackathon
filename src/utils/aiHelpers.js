export function detectCategory(text) {
  const t = text.toLowerCase()
  if (/react|javascript|css|html|node|api|bug|code|frontend|backend|web/.test(t)) return 'Web Development'
  if (/figma|design|ui|ux|poster|logo|color|layout|typography/.test(t)) return 'Design'
  if (/python|data|analysis|sql|pandas|ml|machine|dataset/.test(t)) return 'Data Science'
  if (/interview|career|job|internship|resume|cv|hiring/.test(t)) return 'Career'
  return 'Community'
}

export function suggestTags(text) {
  const t = text.toLowerCase()
  const tags = []
  if (/react/.test(t)) tags.push('React')
  if (/javascript|js/.test(t)) tags.push('JavaScript')
  if (/css|html/.test(t)) tags.push('HTML/CSS')
  if (/responsive|mobile|tablet|breakpoint/.test(t)) tags.push('Responsive')
  if (/figma/.test(t)) tags.push('Figma')
  if (/interview/.test(t)) tags.push('Interview Prep')
  if (/portfolio/.test(t)) tags.push('Portfolio')
  if (/career/.test(t)) tags.push('Career')
  if (/debug|fix|bug|error/.test(t)) tags.push('Debugging')
  if (/python/.test(t)) tags.push('Python')
  if (/git|github/.test(t)) tags.push('Git/GitHub')
  return tags.length ? tags.join(', ') : ''
}

export function detectUrgency(text) {
  const t = text.toLowerCase()
  if (/urgent|asap|today|tonight|hours|deadline|emergency|right now/.test(t)) return 'High'
  if (/tomorrow|soon|week|upcoming|few days/.test(t)) return 'Medium'
  return 'Low'
}

export function generateAISummary(req) {
  const summaries = {
    'Web Development': `Web development request with ${req.urgency.toLowerCase()} urgency. Best suited for members with frontend/backend expertise.`,
    'Design': `A visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value.`,
    'Career': `Career coaching request focused on confidence-building, behavioral answers, and entry-level interviews.`,
    'Data Science': `Data science request requiring analytical skills. Python or SQL experience preferred.`,
    'Community': `Community support request. Open to helpers with broad experience and good communication skills.`,
  }
  return summaries[req.category] || summaries['Community']
}
