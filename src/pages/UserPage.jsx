import { Avatar, Box, Button, HStack, shouldForwardProp, Stack, Text, chakra } from '@chakra-ui/react'
import React from 'react'
import HomeSidebar from '../components/HomeSidebar'
import Navbar from '../components/Navbar'
import {RECOMMENDED_PROFILES} from '../graphql/profile/getRecommendedUsers'
import { GET_USER_PUBLICATIONS } from '../graphql/publication/getUserPublication'
import { useQuery } from '@apollo/client'
import TrendingTags from '../components/TrendingTags'
import { GET_USER_PROFILES } from '../graphql/profile/getUserProfile'
import { useParams } from 'react-router-dom'
import { useMoralis } from 'react-moralis'
import { motion,  isValidMotionProp, animate} from 'framer-motion'
import BounceLoader from 'react-spinners/BounceLoader'

const VideoBox = chakra(motion.div, {
  
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});
export default function UserPage() {
    const {userId}  =  useParams()
    const {account} = useMoralis()
    const {data : recommendedProfiles, loading: isRecommendedProfilesLoading, error: isRecommendedError} =  useQuery(RECOMMENDED_PROFILES)
    const {data: userProfile, loading : isUserProfileLoading, error: isUserProfileError} = useQuery(GET_USER_PROFILES, {
        variables : {
          request : {
            profileId : userId
          }
        }
      })
    const {data :userPubs, error : userPubsError, loading : pubsLoading} = useQuery(GET_USER_PUBLICATIONS, {
        variables : {
          request : {
            profileId : userId,
            publicationTypes :  ["POST",  "MIRROR"],
            sources : ["paxfo"]
          }
        }
       })

      
  return (
   <Box>
    <Navbar  />
    <Box w="90%" h="90vh" mx="auto" maxW="1200px" p={3} display="flex">
    <Box w="49%" h="95%" minWidth="400px" overflowY="hidden" overflowX="hidden"  p={3} borderRadius={12} boxShadow="lg" mr={5}>
        <Box h="72%" overflowY="hidden" overflowX="hidden">
       <HomeSidebar data ={recommendedProfiles} isDataLoading = {isRecommendedProfilesLoading} isDatError = {isRecommendedError}/>
       </Box>
       <TrendingTags />
       </Box>

       <Box w="100%" h="100%" >
        {
          pubsLoading ?
          <Box  w="100%" h="100vh" display="flex" alignItems="center" justifyContent="center">
          <BounceLoader size={100} color="#36d7b7"/>
        </Box> :

          <div>
        <Box display="flex" alignItems="center" mt={3}  p={4} >
            <Avatar   size="2xl"   name='abdul' src={userProfile?.profile.picture?.original.url} />
            <Box display="flex"  ml={10}>
                <Box>
                <Text fontWeight="bold" fontSize={30} textTransform="capitalize" color="gray.800">{userProfile?.profile.handle}</Text>
                <Text
                  color="gray.500"
                  ml={3}
                >{userProfile?.profile.handle}</Text>
                 <Text> u bio  descrip user  bio  descrip user  bio  descrip</Text>
                 <HStack spacing={4} mt={1} p={1}>
                 <Text fontWeight="black" fontSize="lg">{userProfile?.profile.stats.totalFollowers} Followers</Text>
                 <Text  fontWeight="black"  fontSize="lg">{userProfile?.profile.stats.totalFollowing} Following</Text>
                 <Text  fontWeight="black"  fontSize="lg">{userProfile?.profile.stats.totalMirrors} Mirrors</Text>
                 </HStack>
                </Box>
                <Button colorScheme="cyan" ml="auto" w={170} size="lg">Follow</Button>
            </Box>
            
        </Box>
        <Box>

        </Box>
        <Box display="flex" flexWrap="wrap" ml={2} mt={4}>
            
            {userPubs?.publications.items?.map((items, i) => {
             console.log("user publications", userPubs)
                return(
                    <Box w={235} h={312} bgColor="blackAlpha.900" borderRadius={9} mb={4} mr={3} key={i}> 
                    <VideoBox
                     whileHover={{
                      scale: 1.1
                     }}
                      
                    
                    >
                  {items?.metadata.media?.map((media, index) => {
                     
                    return(
                      <div key={index}>
                      <video  src={media.original.url} key={i}  style={{width: "235px",  height: "312px", borderRadius: "14px", minWidth : "235px", objectFit : "cover" 
                    }}
                     
                      ></video>
                      </div>
                    )
                  })}
                    
                    </VideoBox>
                    </Box>
                )
            })}

           
            </Box>
            </div>
}
       </Box>
       
    </Box>
   </Box>
  )
}
