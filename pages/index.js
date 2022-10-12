import Landing from "views/Landing";

import { getProcedures } from "../sanity/queries";

export default function Home(props) {
  return <Landing {...props} />;
}

export const getServerSideProps = async ({ res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const procedures = await getProcedures();

  return {
    props: {
      procedures,
    },
  };
};
