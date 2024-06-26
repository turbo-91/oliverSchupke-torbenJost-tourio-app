import Link from "next/link";
import { useRouter } from "next/router.js";
import useSWR from "swr";
import styled from "styled-components";
import { StyledLink } from "../../../components/StyledLink.js";
import { StyledButton } from "../../../components/StyledButton.js";
import { StyledImage } from "../../../components/StyledImage.js";
import Comments from "../../../components/Comments.js";

const ImageContainer = styled.div`
  position: relative;
  height: 15rem;
`;

const ButtonContainer = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 0.2rem;

  & > * {
    flex-grow: 1;
    text-align: center;
  }
`;

const StyledLocationLink = styled(StyledLink)`
  text-align: center;
  background-color: white;
  border: 3px solid lightsalmon;
`;

export default function DetailsPage() {
  const router = useRouter();

  const { id } = router.query;
  const { data, isLoading, error, mutate } = useSWR(`/api/places/${id}`);

  if (isLoading || error) return <h2>Loading...</h2>;

  async function addComment(comment) {
    const response = await fetch(`/api/places/${id}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      mutate();
    } else {
      console.error(`Error: ${response.status}`);
    }
  }

  async function deletePlace(id) {
    const response = await fetch(`/api/places/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await response.json();
      router.push("/");
    } else {
      console.error(`Error: ${response.status}`);
    }
  }

  return (
    <>
      <Link href={"/"} passHref legacyBehavior>
        <StyledLink justifySelf="start">back</StyledLink>
      </Link>
      <ImageContainer>
        <StyledImage
          src={data.image}
          priority
          fill
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          alt=""
        />
      </ImageContainer>
      <h2>
        {data.name}, {data.location}
      </h2>
      <Link href={data.mapURL} passHref legacyBehavior>
        <StyledLocationLink>Location on Google Maps</StyledLocationLink>
      </Link>
      <p>{data.description}</p>
      <ButtonContainer>
        <Link href={`/places/${id}/edit`} passHref legacyBehavior>
          <StyledLink>Edit</StyledLink>
        </Link>
        <StyledButton
          onClick={() => deletePlace(id)}
          type="button"
          variant="delete"
        >
          Delete
        </StyledButton>
      </ButtonContainer>
      <Comments
        onSubmit={addComment}
        locationName={data.name}
        comments={data.comments}
      />
    </>
  );
}
