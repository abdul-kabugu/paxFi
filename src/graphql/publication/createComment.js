import {gql} from '@apollo/client'
import {apolloClient} from '../Authentication/apoloClient'
import useSignIn from '../Authentication/useSignIn'
import {signText, signedTypeData, splitSignature} from '../../ether-service'
import {v4 as uuidv4} from 'uuid'
import { useMoralis,  useMoralisFile} from 'react-moralis'
import { lensHub } from '../../lens-hub'

const CREATE_COMMENT_TYPED_DATA = `
  mutation($request: CreatePublicCommentRequest!) { 
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
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
        profileIdPointed
        pubIdPointed
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
        referenceModuleData
      }
     }
   }
 }
`;

// TODO types
const createCommentTypedData = (createCommentTypedDataRequest) => {
    return apolloClient.mutate({
      mutation: gql(CREATE_COMMENT_TYPED_DATA),
      variables: {
        request: createCommentTypedDataRequest,
      },
    });
  };

  const useCreateComment = () => {
    const {saveFile, isUploading, moralisFile, error: uploadingError} = useMoralisFile()
    const {account, isInitialized, isAuthenticated, Moralis, user} = useMoralis()
    const  thePrfId = user?.attributes.lensProfileId
    const {signIn} = useSignIn()
    const createComment = async (caption, postId) => {
        if(!thePrfId){
            alert("connect  your  profile first")
         }
        
            const metadata = {
              version: '1.0.0',
              metadata_id: uuidv4(),
              description: caption,
              content: caption,
              external_url: null,
              image: null,
              imageMimeType: null,
              name: caption,
              attributes: [],
              media: [],
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
        console.log("comment ipfs hash", ipfsResult._ipfs)

        const createCommentRequest = {
            profileId : thePrfId,
            publicationId :  postId,     
            contentURI: ipfsResult._ipfs, 
            collectModule : {
                freeCollectModule : {
                   followerOnly : false
                }
                },
                referenceModule: {
                   followerOnlyReferenceModule: false,
                 },  
                }
                try{
                const result = await createCommentTypedData(createCommentRequest);
                const typedData = result.data.createCommentTypedData.typedData;
                const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
                const { v, r, s } = splitSignature(signature);
                  
                const tx = await lensHub.commentWithSig({
                    profileId: typedData.value.profileId,
                    contentURI: typedData.value.contentURI,
                    profileIdPointed: typedData.value.profileIdPointed,
                    pubIdPointed: typedData.value.pubIdPointed,
                    collectModule: typedData.value.collectModule,
                    collectModuleInitData: typedData.value.collectModuleInitData,
                    referenceModule: typedData.value.referenceModule,
                    referenceModuleInitData: typedData.value.referenceModuleInitData,
                    referenceModuleData: typedData.value.referenceModuleData,
                    sig: {
                      v,
                      r,
                      s,
                      deadline: typedData.value.deadline,
                    },
                  });
                  console.log('create comment: tx hash', tx.hash);

                }catch (error) {
                    alert(error)
                }



    }
    return {createComment}
  }
  export default useCreateComment