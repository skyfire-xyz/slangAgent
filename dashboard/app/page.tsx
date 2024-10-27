import Hero from "./detail/[id]/components/hero"
import AiChat from "../components/ai-chat";


export default function IndexPage() {
  return (
    <>
      <section>
        <Hero />
      </section>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <AiChat images={[]} />
      </section>
    </>
  )
}
