import { Box, Heading } from '@chakra-ui/react'
import React from 'react'
import HomeSidebar from '../components/HomeSidebar'
import Navbar from '../components/Navbar'
import {RECOMMENDED_PROFILES} from '../graphql/profile/getRecommendedUsers'
import {EXPLORE_PUBLICATIONS} from '../graphql/publication/getPublication'
import { useQuery } from "@apollo/client";
import TrendingTags from '../components/TrendingTags'
import PostContainer from '../components/PostContainer'
import '../global-styles.css'
export default function Home() {
  const {data : recommendedProfiles, loading: isRecommendedProfilesLoading, error: isRecommendedError} =  useQuery(RECOMMENDED_PROFILES)
  const {data :posts, loading: isPostsLoading, error : isPostsError} = useQuery(EXPLORE_PUBLICATIONS)
 // console.log(posts)
  return (
   <Box >
      
      <Navbar />
      <Box w="90%" h="90vh" mx="auto" maxW="1200px" p={3} display="flex">
       <Box w="49%" h="95%" minWidth="400px" overflowY="hidden" overflowX="hidden"  p={3} borderRadius={12} boxShadow="lg" mr={5}>
        <Box h="72%" overflowY="hidden" overflowX="hidden">
       <HomeSidebar data ={recommendedProfiles} isDataLoading = {isRecommendedProfilesLoading} isDatError = {isRecommendedError}/>
       </Box>
       <TrendingTags />
       </Box>
       
       <Box  w="100%" p={3} h="100%"  overflowY="scroll" sx={{
            '&::-webkit-scrollbar': {
              display: "none",
              '-ms-overflow-style' : "none"
            },
       }}>
       
       <PostContainer data ={posts}/>
      
       </Box>
      
      </Box>
     
      </Box>
  )
}

