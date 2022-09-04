import React, {useState, useEffect} from 'react'
import { ConnectButton } from "@web3uikit/web3"
import { useMoralis } from 'react-moralis'
import { RiEdit2Line, RiMenu2Line, RiUpload2Line, RiVideoAddLine } from 'react-icons/ri'
import useSignIn from '../graphql/Authentication/useSignIn'
import { FiLogIn } from 'react-icons/fi'
import {CgProfile} from 'react-icons/cg'
import {Link, useNavigate} from 'react-router-dom'
import {GET_USER_PROFILES} from '../graphql/profile/getUserProfile'
import {useQuery} from '@apollo/client'

import { Box, Input, InputGroup, InputRightElement,
Menu,  MenuItem, Tag, 
MenuList, Button, MenuButton,
useColorMode, IconButton, Img, Text, Modal,
ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, 
ModalBody,
Heading,
ModalFooter,
Avatar,
Drawer,
DrawerOverlay,
DrawerContent,
DrawerCloseButton,
DrawerHeader,
DrawerBody,
DrawerFooter,
useToast,
InputLeftElement

} from '@chakra-ui/react'
import { GiDropWeapon, GiGroupedDrops } from 'react-icons/gi'
import {MdDarkMode, MdLightMode, MdOutlineDarkMode, MdOutlineLightMode} from 'react-icons/md'
import { FaSearch, FaAppStore, FaAndroid, FaChevronDown, FaGooglePlay, FaPowerOff  } from "react-icons/fa"
export default function Navbar() {
    const [searchTxt, setSearchTxt] = useState("")
    const [isLoginOpen, setIsLogInModal] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isSetProfileModal, setisSetProfileModal] = useState(false)
    const [isProfileDrawer, setisProfileDrawer] = useState(false)
    const {authenticate, account, isAuthenticated, user, setUserData, isUserUpdating} = useMoralis()
    const [lensPrfId, setLensPrfId] = useState("")
    const [lensHandle, setLensHandle] = useState("")

    const {data: userProfile, loading : isUserProfileLoading, error: isUserProfileError} = useQuery(GET_USER_PROFILES, {
      variables : {
        request : {
          profileId :  user?.attributes?.lensProfileId                 //userId
        }
      }
    }) 
    const { colorMode, toggleColorMode } = useColorMode()
    
    const {signIn} = useSignIn()
    const LENS_ACCESS_TOKEN = sessionStorage.getItem('accessToken')
     const navigate = useNavigate()
      const toggleLogInModal = () => {
        isLoginOpen ? setIsLogInModal(false) : setIsLogInModal(true)
      }
      const toggleProfDrawer = () => {
        isProfileDrawer ? setisProfileDrawer(false) : setisProfileDrawer(true)
      }
       const slicedAccount = `${account?.slice(0,4)}... ${account?.slice(39)}`
       const toast = useToast()
      const signInLens = async () => {
        try{
          await  signIn()
          setIsLoggedIn(true)
          toggleLogInModal()
         
        }catch{
          toast({
            title: "Something went wrong ",
            position: "bottom-right",
            status : "error",
            description: "Refresh  and  retry again ",
            
            duration: 9000,
            isClosable: true,
          })
        }
      }
      
  
      const handleUploadBtn = () => {
        if(isAuthenticated && LENS_ACCESS_TOKEN !== null ){
          navigate("/upload")
        }else{
          toast({
            title: "You're unauthenticated",
            position: "bottom-right",
            status : "error",
            description: "Connect Your  wallet  to Upload ",
            
            duration: 9000,
            isClosable: true,
          })
        }
      }
      const toggleConnectPrfModal = () => {
        isSetProfileModal? setisSetProfileModal(false) : setisSetProfileModal(true)
        setisProfileDrawer(false)
      }
         // connect  your  lens profile 
       const addLensPrf = async () => {
        try {
        await setUserData({
          lensProfileId : lensPrfId,
          lensHandle: lensHandle
        })
        setLensHandle("")
        setLensPrfId("")
      } catch {
        toast({
          title: "Something went wrong ",
          position: "bottom-right",
          status : "error",
          description: "Refresh  and  retry again ",
          
          duration: 9000,
          isClosable: true,
        })
      }
     }

    
   
  return (
    <Box w="90%" mx="auto"   h={59} p={3} display="flex" alignItems="center" maxWidth="1200px" justifyContent="space-between" mt={2}>
        <Box display="flex"  w={480} justifyContent="space-between">
        <Link to="/"><GiGroupedDrops  size={40} color="#2BBB7F" cursor="pointer"/></Link>
          <InputGroup colorScheme="red"  w={300} color="cyan.600">
           <InputRightElement children={<FaSearch  color='gray'/>} cursor="pointer"/>
           <Input value={searchTxt}  onChange={e => setSearchTxt(e.target.value)}
           placeholder="videos #hashtag users and more"
           />
          </InputGroup>

          <Menu>
        <MenuButton as={Button}
          rightIcon={<FaChevronDown />}
        >  Get App</MenuButton>
        <MenuList>
          <MenuItem><FaAndroid  style={{borderRadius: "50%",  marginRight: "5px"}}/>          Download Android APK  <Tag colorScheme="red" px={2}>coming soon</Tag> </MenuItem>
          <MenuItem><FaGooglePlay     style={{borderRadius: "50%",  marginRight: "5px"}} /> Get the Android App <Tag colorScheme="red" px={2}>coming soon</Tag> </MenuItem>
          <MenuItem><FaAppStore      style={{borderRadius: "50%",  marginRight: "5px"}}/> Get the Iphone App <Tag colorScheme="red" px={2}>coming soon</Tag>  </MenuItem>
          
        </MenuList>
       </Menu>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
        {colorMode  === "light"  ? (
          <IconButton     icon={<MdOutlineDarkMode size={30}/>}     onClick={toggleColorMode}  mr={5}/>
         ): (
          <IconButton  icon={<MdOutlineLightMode size={30}/>}  onClick={toggleColorMode} mr={5}/>
         )}
          <Button leftIcon={<RiVideoAddLine size={23}/>} colorScheme="cyan" variant="outline" onClick={handleUploadBtn} mx={3} w="120px">Upload</Button>
        {
          !isAuthenticated || !account ? 
          <Button onClick={() => authenticate({chainId : 0x13881, signingMessage:"connect your  wallet to poox"})} colorScheme="cyan" variant="outline">connect</Button> :
           isAuthenticated && LENS_ACCESS_TOKEN == null && !isLoggedIn?
            <Button w="120px" leftIcon={<img src='/img/lens-2.png'   style={{width: "20px"}}/>} colorScheme="cyan" onClick={toggleLogInModal}>Login</Button> :
            <Box boxShadow="md" border="1px" borderColor="gray.200" display="flex" px={4} py={1} borderRadius={5} cursor="pointer">
           <Avatar size={13} name='L' src='https://nftcoders.com/avatar/avatar-cool.svg'   style={{width: "27px"}} /> 
           <Text ml={4}>{slicedAccount}</Text>
              </Box>
        
        }
            


           <RiMenu2Line size={35} style={{marginLeft : "14px",  cursor: "pointer"}} onClick={toggleProfDrawer} />
            {/*SIDEBAR DRAWER */}
            <Drawer isOpen={isProfileDrawer} placement="right" onClose={toggleProfDrawer}>
             <DrawerOverlay />
             <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader display="flex">
                <Avatar name='user' src='https://nftcoders.com/avatar/avatar-cool.svg'   />
                 <Text ml={5}>{user?.attributes?.lensHandle}</Text>
              </DrawerHeader>
              <DrawerBody>
               <Box display="flex" justifyContent="space-between" alignItems="center" w="90%">
               {userProfile?.profile.stats.totalFollowers ? (
             <Text fontSize="lg">{userProfile?.profile.stats.totalFollowers} Followers</Text>
               ) : (
                <Text>0  Followers</Text>
                )}
                {userProfile?.profile.stats.totalFollowing ? (
             <Text fontSize="lg">{userProfile?.profile.stats.totalFollowing} Following</Text>
           ) : (
            <Text>0  Following</Text>
           )}

            
               </Box>
               <Box display="flex" ml={1} w="90%" alignItems="center" mt={5}>
                
                 <Text ml={1}  fontSize="lg">Point Blance</Text>
                 <Text ml={2} fontWeight="black" fontSize="lg"> 400</Text>
               </Box>
               <Box ml={1} mt={5} display="flex" alignItems="center" >
                <Button leftIcon={<RiEdit2Line />}  colorScheme="cyan" variant="outline" onClick={toggleConnectPrfModal} >Edit my profile</Button>
               </Box>
              </DrawerBody>
              <DrawerFooter>
                  <Button w="100%" colorScheme="cyan" disabled>Log out</Button>
                 </DrawerFooter>
             </DrawerContent>
            </Drawer>
           {/*LOG-IN MODAL */}
           <Modal isOpen={isLoginOpen} onClose={toggleLogInModal} isCentered>
            <ModalOverlay />
            <ModalContent>
             <ModalHeader display="flex" alignItems="center">
              <FiLogIn size={13} style={{marginRight : "12px"}}/>
             <Text fontSize='md'>  Login</Text>
             </ModalHeader>
             <ModalCloseButton    />
             <ModalBody>
             <Heading fontSize="lg">Please sign the message.</Heading>
             <Text fontSize="md"> Poox uses this signature to verify that you’re the owner of this address. </Text>
              <ModalFooter>
              <Button colorScheme="cyan" leftIcon={<img src='/img/lens-2.png'   style={{width: "20px"}}/>} onClick={signInLens}>Sign-In with lens</Button>
              </ModalFooter>
             </ModalBody>
            </ModalContent>
           </Modal>

          {/* SET PROFILE MODAL   */}
          <Modal isOpen={isSetProfileModal} onClose={toggleConnectPrfModal} isCentered
      >
        <ModalOverlay   />
        <ModalContent>
          <ModalHeader >Connect Your  Profile</ModalHeader>
          <ModalCloseButton  />
          <ModalBody> 
            <Heading color="blackAlpha" size="lg" textAlign="center" mb={5}>Connect  Your Lens Profile</Heading>
              <InputGroup>
                <InputLeftElement  
                  
                  children={<CgProfile />}
                />
                <Input   placeholder='Enter Your Lens Handle'  onChange={e =>  setLensHandle(e.target.value)}   mb={5} border/>
                
              </InputGroup>
              <InputGroup>
                <InputLeftElement  
                  
                  children={<CgProfile />}
                />
                <Input   placeholder='Enter Your Lens Profile Id'  onChange={e =>  setLensPrfId(e.target.value)}   mb={5} />
              </InputGroup>
              
               
             </ModalBody>
          <ModalFooter>
         <Button w="200px"  colorScheme="cyan" onClick={() => addLensPrf() }>
              Save
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>

   
        </Box>
        
    </Box>
  )
}
