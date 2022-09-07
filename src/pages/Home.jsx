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
import { useState, useEffect } from 'react'
import useCollectors from '../hooks/useColectors'
import { useMoralis, useMoralisQuery } from 'react-moralis'
export default function Home() {
  const {account, user, initialize, isInitialized, isAuthenticated} = useMoralis()
  const [userData, setUserData] = useState()
  const [userRunes, setUserRunes] = useState(0)
  const [daysStreak, setDaysStreak] = useState(-1)

  const {data : recommendedProfiles, loading: isRecommendedProfilesLoading, error: isRecommendedError} =  useQuery(RECOMMENDED_PROFILES)
  const {data :posts, loading: isPostsLoading, error : isPostsError} = useQuery(EXPLORE_PUBLICATIONS)
  console.log(posts)
  const {getUser} = useCollectors()
  useEffect(() => {
    if(isInitialized, isAuthenticated ){
      const  fetch =  async () => {
      const data =  await getUser()

          const {daysInArow, lastCollected, runes} = data.attributes;
          setUserRunes(runes)
      }
      fetch()
    }else {
      setUserRunes(0)
  
     }
    
   
  }, [posts?.explorePublications.items, isAuthenticated, isInitialized, userRunes ])
 console.log("this is user data from home", userRunes)
  
  return (
   <Box >
      
      <Navbar collectedTokens = {userRunes}/>
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
       
       <PostContainer data ={posts} isLoading = {isPostsLoading} isError  = {isPostsError}/>
      
       </Box>
      
      </Box>
     
      </Box>
  )
}

