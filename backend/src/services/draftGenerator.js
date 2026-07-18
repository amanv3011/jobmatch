/**
 * Produces a starter cover-letter draft from the resume and a job posting.
 * Template-based by default (no external dependency). If ANTHROPIC_API_KEY
 * is set, swap this for a real call to the Anthropic Messages API for a
 * genuinely tailored draft — the interface below stays the same either way.
 */
export function generateDraft({ resumeText, job }) {
  const topSkills = (job.matchedSkills || []).slice(0, 5).join(', ');

  return [
    `Dear ${job.company} Hiring Team,`,
    '',
    `I'm writing to apply for the ${job.title} role${job.location ? ` (${job.location})` : ''}.`,
    topSkills
      ? `My background lines up closely with what you're looking for, particularly around ${topSkills}.`
      : `My background lines up closely with what this role calls for.`,
    '',
    '[Paste 2-3 sentences here on a specific project or result from your resume that maps to this job\'s top requirement.]',
    '',
    "I'd welcome the chance to talk more about how I could contribute to the team.",
    '',
    'Best regards,',
    '[Your name]'
  ].join('\n');
}
