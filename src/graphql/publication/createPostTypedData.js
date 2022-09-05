import {gql} from '@apollo/client'
import {apolloClient} from '../Authentication/apoloClient'
import useSignIn from '../Authentication/useSignIn'
import {signText, signedTypeData, splitSignature} from '../../ether-service'
import {v4 as uuidv4} from 'uuid'
import { useMoralis,  useMoralisFile} from 'react-moralis'
import { lensHub } from '../../lens-hub'

const CREATE_POST_TYPED_DATA = `
  mutation($request: CreatePublicPostRequest!) { 
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
    }
  }
}
`;

//TODO typings
const createPostTypedData = (createPostTypedDataRequest) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_POST_TYPED_DATA),
    variables: {
      request: createPostTypedDataRequest,
    },
  });
};

const  useCreatePost = () => {
    const {saveFile, isUploading, moralisFile, error: uploadingError} = useMoralisFile()
  const {account, isInitialized, isAuthenticated, Moralis, user} = useMoralis()
  const  thePrfId = user?.attributes.lensProfileId
  const {signIn} = useSignIn()
  const createPost = async (description,caption, tags, mediaURI, mycollectModule, postRefrence, thePostModule, getPostRefrenceModule ) => {
         //Initialize  post  metadata
         if(!thePrfId){
            alert("connect  your  profile first")
         }
        
    const metadata = {
          version: '2.0.0',
          metadata_id: uuidv4(),
          description: description,
          content: caption,
          locale : "- en",
           tags : tags,
           mainContentFocus : {
            VIDEO : 'VIDEO',
           },
          external_url: null,
          image: null,
          imageMimeType: null,
          name: caption,
          attributes: [],
          media: [
             {
            item:mediaURI,
             type: 'video/mp4',
            },
          ],
         
          animation_url : mediaURI,
          appId: 'paxfi',
        }

        
          const  ipfsResult = await saveFile(
            "mypost.json",
            {base64: btoa(JSON.stringify(metadata))},
            {
              type : "base64",
              saveIPFS : true
            }
          )
        console.log("post ipfs hash", ipfsResult._ipfs)

      

        const createPostRequest = {
            profileId: thePrfId,
            contentURI: ipfsResult._ipfs,
              collectModule : thePostModule(),
               referenceModule: getPostRefrenceModule()
             }
           try{
        const result = await createPostTypedData(createPostRequest)
        const typedData = result.data.createPostTypedData.typedData;
        const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
        const { v, r, s } = splitSignature(signature);

        const tx = await lensHub.postWithSig({
          profileId: typedData.value.profileId,
          contentURI:typedData.value.contentURI,
          collectModule: typedData.value.collectModule,
          collectModuleInitData: typedData.value.collectModuleInitData,
          referenceModule: typedData.value.referenceModule,
          referenceModuleInitData: typedData.value.referenceModuleInitData,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        });
        console.log(tx.hash);
        // 0x64464dc0de5aac614a82dfd946fc0e17105ff6ed177b7d677ddb88ec772c52d3
        // you can look at how to know when its been indexed here: 
        //   - https://docs.lens.dev/docs/has-transaction-been-indexed
        }catch (error)  {
          console.log(error)
        }
          
        
        
       

    
   
      
}
return {createPost}
}

export default useCreatePost





