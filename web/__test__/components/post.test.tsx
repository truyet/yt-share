import { render, screen } from "@testing-library/react";
import {Post} from "@/components/post";

describe("MainNav Component", () => {
  it("renders", () => {
    const imgUrl = "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
    const post = {id: 1, author: {id: 1, email: 'admin@gmail.com'}, authorId: 1, description: 'description', title: 'title', dislikeCount: 0, likeCount: 0, userInteraction: '', videoUrl: '', thumbnails: `{"medium": {"url": "${imgUrl}"}}`}
    render(<Post post={post} profile={{}} />)

    const img = screen.getByRole('img')

    expect(img).toBeDefined()
    expect(img).toHaveProperty('src', imgUrl)
    expect(screen.getByText(post.title)).toBeDefined();
    expect(screen.getByText(post.description)).toBeDefined();
    expect(screen.findByText(post.author.email)).toBeDefined();

  });
});