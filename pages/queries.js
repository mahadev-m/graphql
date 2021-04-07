import { gql } from "@apollo/client";
const Get_data = gql`
  query GetLaunches {
    launchesPast(limit: 115) {
      id
      mission_name
      launch_date_local
      launch_site {
        site_name_long
      }
      links {
        article_link
        video_link
        mission_patch
      }
      rocket {
        rocket_name
      }
    }
  }
`;
export default Get_data;
