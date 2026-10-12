import { Link } from 'react-router-dom'
import { PageTitle } from '@/components/ui/page-title'
import { SectionTitle } from '@/components/ui/section-title'
import {
  PRIVACY_SECTIONS,
  PRIVACY_TEXTS,
} from '@/features/privacy/constants/texts'

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-page p-6">
      <article className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <PageTitle title={PRIVACY_TEXTS.title} />
          <span className="text-caption">{PRIVACY_TEXTS.updatedAt}</span>
        </div>
        {PRIVACY_SECTIONS.map((section) => (
          <section key={section.title} className="flex flex-col gap-2">
            <SectionTitle>{section.title}</SectionTitle>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm text-fg">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        <Link to="/" className="text-caption underline hover:text-fg">
          {PRIVACY_TEXTS.back}
        </Link>
      </article>
    </main>
  )
}
