import {gql} from '@apollo/client'
import {apolloClient} from '../Authentication/apoloClient'
import useSignIn from '../Authentication/useSignIn'
import {signText, signedTypeData, splitSignature} from '../../ether-service'
import {v4 as uuidv4} from 'uuid'
import { useMoralis,  useMoralisFile} from 'react-moralis'
import { lensHub } from '../../lens-hub'

const CREATE_MIRROR_TYPED_DATA = `
  mutation($request: CreateMirrorRequest!) { 
    createMirrorTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          MirrorWithSig {
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
        referenceModuleData
        referenceModule
        referenceModuleInitData
      }
     }
   }
 }
`;

// TODO types
const createMirrorTypedData = (createMirrorTypedDataRequest) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_MIRROR_TYPED_DATA),
    variables: {
      request: createMirrorTypedDataRequest,
    },
  });
};

const useCreateMirror = () => {
    const {saveFile, isUploading, moralisFile, error: uploadingError} = useMoralisFile()
    const {account, isInitialized, isAuthenticated, Moralis, user} = useMoralis()
    const  thePrfId = user?.attributes.lensProfileId

  const createMirror  = async (postId) => {
      if(!thePrfId){
            alert("connect  your  profile first")
         }
      const createMirrorRequest = {
        profileId : thePrfId,
        publicationId: postId,
        referenceModule: {
            followerOnlyReferenceModule: false,
          },
      }
      try{
      const result = await createMirrorTypedData(createMirrorRequest);
      const typedData = result.data.createMirrorTypedData.typedData;
      const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
      const { v, r, s } = splitSignature(signature);

      const tx = await lensHub.mirrorWithSig({
        profileId: typedData.value.profileId,
        profileIdPointed: typedData.value.profileIdPointed,
        pubIdPointed: typedData.value.pubIdPointed,
        referenceModuleData: typedData.value.referenceModuleData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      });
    } catch (error) {
        alert(error)
    }
  }
  return {createMirror}
}
export default useCreateMirror