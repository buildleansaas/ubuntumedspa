import React from "react";

export default function Procedures() {
  return <></>;
}

export const getServerSideProps = ({ query, params }) => {
  return {
    redirect: {
      destination: "/#about",
      permanent: true,
    },
  };
};
