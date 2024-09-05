
import asyncio
import py_nillion_client as nillion
import os
from dotenv import load_dotenv
from typing import List
from cosmpy.aerial.client import LedgerClient
from cosmpy.aerial.wallet import LocalWallet
from cosmpy.crypto.keypairs import PrivateKey
from flask_cors import CORS
from py_nillion_client import NodeKey, UserKey

from nillion_python_helpers import get_quote_and_pay, create_nillion_client, create_payments_config
from flask import Flask, jsonify, request

app = Flask(__name__)
CORS(app)

home = os.getenv("HOME")
load_dotenv(f"{home}/.config/nillion/nillion-devnet.env")



@app.route('/')
def hello_world():
    return 'Hello, World!'


async def generate_userId_func(seed):
    client = create_nillion_client(
        UserKey.from_seed(seed), NodeKey.from_seed(seed)
    )

    userid = client.user_id
    return userid


async def storing_program_func(programOwnerSeed):
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    grpc_endpoint = os.getenv("NILLION_NILCHAIN_GRPC")
    chain_id = os.getenv("NILLION_NILCHAIN_CHAIN_ID")

    program_name="feedback_program"


    ownerClient = create_nillion_client(
        UserKey.from_seed(programOwnerSeed), NodeKey.from_seed(programOwnerSeed)
    )



    payments_config = create_payments_config(chain_id, grpc_endpoint)
    payments_client = LedgerClient(payments_config)
    payments_wallet = LocalWallet(
        PrivateKey(bytes.fromhex(os.getenv("NILLION_NILCHAIN_PRIVATE_KEY_0"))),
        prefix="nillion",
    )

    program_mir_path = os.path.abspath(f"examples_and_tutorials/nada_programs/target/{program_name}.nada.bin")
    
    if os.path.exists(program_mir_path):
        None
    else:
        raise FileNotFoundError(
            f"The file '{program_mir_path}' does not exist.\nMake sure you compiled the PyNada programs with './compile_programs.sh'.\nCheck README.md for more details."
        )

    # Get cost quote, then pay for operation to store program
    receipt_store_program = await get_quote_and_pay(
        ownerClient,
        nillion.Operation.store_program(program_mir_path),
        payments_wallet,
        payments_client,
        cluster_id,
    )

    # Store program in the Network
    print(f"Storing program in the network: {program_name}")
    action_id = await ownerClient.store_program(
        cluster_id, program_name, program_mir_path, receipt_store_program
    )
    print("action_id is: ", action_id)
    owner_user_id = ownerClient.user_id
    program_id = f"{owner_user_id}/{program_name}"
    print("program_id is: ", program_id)

    ####################################
    # 3. Send program ID                #
    ####################################

    # This requires its own mechanism in a real environment.
    print(f"Alice stored {program_name} program at program_id: {program_id}")


    return program_id


async def storing_vote_func(programId, seed, vote_value, programOwnerSeed, secret_name):
    # need programId to bind votes
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    grpc_endpoint = os.getenv("NILLION_NILCHAIN_GRPC")
    chain_id = os.getenv("NILLION_NILCHAIN_CHAIN_ID")


    program_owner_client = create_nillion_client(
        UserKey.from_seed(programOwnerSeed), NodeKey.from_seed(programOwnerSeed)
    )

    client = create_nillion_client(
        UserKey.from_seed(seed), NodeKey.from_seed(seed)
    )

    # Create payments config and set up Nillion wallet with a private key to pay for operations
    payments_config = create_payments_config(chain_id, grpc_endpoint)
    payments_client = LedgerClient(payments_config)
    payments_wallet = LocalWallet(
        PrivateKey(bytes.fromhex(os.getenv("NILLION_NILCHAIN_PRIVATE_KEY_0"))),
        prefix="nillion",
    )


    # Create a secret integer with the vote value
    stored_secret = nillion.NadaValues({
        secret_name: nillion.SecretInteger(vote_value)
    })

    permissions = nillion.Permissions.default_for_user(client.user_id)

    # # Give compute permissions to Alice so she can use the secret in the specific voting program by program id
    compute_permissions = {
        program_owner_client.user_id: {programId},
    }
    
    # permissions.add_compute_permissions(compute_permissions)
    # compute_permissions = {
    #     program_owner_client.user_id: {"56DJR2GD8mLVtRiTwQqo7Fos2sfonJ3kTPGaNVupQ118rMrVGbFhkQtYqYocaFvHrgvXLSBC66EVqHF79jsSaST7/feedback_program"},
    # }
    
    permissions.add_compute_permissions(compute_permissions)

    # Get cost quote, then pay for operation to store the secret
    receipt_store = await get_quote_and_pay(
        client,
        nillion.Operation.store_values(stored_secret, ttl_days=5),
        payments_wallet,
        payments_client,
        cluster_id,
    )

    store_id = await client.store_values(
            cluster_id, stored_secret, permissions, receipt_store
        )
    

    # store id before passing
    print(f"The secret is stored at store_id: {store_id}")
    
     # Get cost quote, then pay for operation to retrieve the secret
    receipt_store = await get_quote_and_pay(
        client,
        nillion.Operation.retrieve_value(),
        payments_wallet,
        payments_client,
        cluster_id,
    )

    # Reader retrieves the named secret by store id
    print(f"Retrieving secret as reader: {client.user_id}")
    result_tuple = await client.retrieve_value(
        cluster_id, store_id, secret_name, receipt_store
    )

    print(f"The secret name as a uuid is {result_tuple[0]}")
    print(f"The secret value is {result_tuple[1].value}")
    
    return store_id


async def compute_func(stored_secret_ids: List[str], subOrganisersSeed: List[str], participantSeed : str, programId: str):
    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    grpc_endpoint = os.getenv("NILLION_NILCHAIN_GRPC")
    chain_id = os.getenv("NILLION_NILCHAIN_CHAIN_ID")

    payments_config = create_payments_config(chain_id, grpc_endpoint)
    payments_client = LedgerClient(payments_config)
    payments_wallet = LocalWallet(
        PrivateKey(bytes.fromhex(os.getenv("NILLION_NILCHAIN_PRIVATE_KEY_0"))),
        prefix="nillion",
    )


    participant_client = create_nillion_client(
        UserKey.from_seed(participantSeed), NodeKey.from_seed(participantSeed)
    )

    # compute_bindings = nillion.ProgramBindings("56DJR2GD8mLVtRiTwQqo7Fos2sfonJ3kTPGaNVupQ118rMrVGbFhkQtYqYocaFvHrgvXLSBC66EVqHF79jsSaST7/feedback_program")
    compute_bindings = nillion.ProgramBindings(programId)

    # subOrganiser_client1 = create_nillion_client(
    #     UserKey.from_seed("voter1ForEcoAttest"), NodeKey.from_seed("voter1ForEcoAttest")
    # )
    # compute_bindings.add_input_party(f"SubOrganiser1", subOrganiser_client1.party_id)

    # subOrganiser_client2 = create_nillion_client(
    #     UserKey.from_seed("Jaydeep"), NodeKey.from_seed("Jaydeep")
    # )
    # compute_bindings.add_input_party(f"SubOrganiser2", subOrganiser_client2.party_id)

    # subOrganiser_client3 = create_nillion_client(
    #     UserKey.from_seed("Fidal"), NodeKey.from_seed("Fidal")
    # )

    # compute_bindings.add_input_party(f"SubOrganiser3", subOrganiser_client3.party_id)


    for i, seed in enumerate(subOrganisersSeed):
        subOrganiser_client = create_nillion_client(
            UserKey.from_seed(seed), NodeKey.from_seed(seed)
        )
        compute_bindings.add_input_party(f"SubOrganiser{i+1}", subOrganiser_client.party_id)

    compute_bindings.add_output_party("participant1", participant_client.party_id)

    # Empty compute_time_secrets
    compute_time_secrets = nillion.NadaValues({})

    print(f"Getting Quote:")
    receipt_compute = await get_quote_and_pay(
        participant_client,
        nillion.Operation.compute(programId, compute_time_secrets),
        payments_wallet,
        payments_client,
        cluster_id,
    )
    print(f"Quote received. Receipt: {receipt_compute}")

    print(f"Sending computation to the network")
    compute_id = await participant_client.compute(
        cluster_id,
        compute_bindings,
        stored_secret_ids,
        compute_time_secrets,
        receipt_compute,
    )

    print(f"The computation was sent to the network. compute_id: {compute_id}")

    while True:
        compute_event = await participant_client.next_compute_event()
        if isinstance(compute_event, nillion.ComputeFinishedEvent):
            print(f"✅  Compute complete for compute_id {compute_event.uuid}")
            print(compute_event)
            print(compute_event.result.value)
            return compute_event.result.value

async def retrieve_secret_func(seed, store_id, secret_name):
    client = create_nillion_client(
        UserKey.from_seed(seed), NodeKey.from_seed(seed)
    )

    cluster_id = os.getenv("NILLION_CLUSTER_ID")
    grpc_endpoint = os.getenv("NILLION_NILCHAIN_GRPC")
    chain_id = os.getenv("NILLION_NILCHAIN_CHAIN_ID")

    payments_config = create_payments_config(chain_id, grpc_endpoint)
    payments_client = LedgerClient(payments_config)
    payments_wallet = LocalWallet(
        PrivateKey(bytes.fromhex(os.getenv("NILLION_NILCHAIN_PRIVATE_KEY_0"))),
        prefix="nillion",
    )
    # Get cost quote, then pay for operation to retrieve the secret
    receipt_store = await get_quote_and_pay(
        client,
        nillion.Operation.retrieve_value(),
        payments_wallet,
        payments_client,
        cluster_id,
    )

    # Reader retrieves the named secret by store id
    print(f"Retrieving secret as reader: {client.user_id}")
    result_tuple = await client.retrieve_value(
        cluster_id, store_id, secret_name, receipt_store
    )

    print(f"The secret name as a uuid is {result_tuple[0]}")
    print(f"The secret value is {result_tuple[1].value}")
    return result_tuple[1].value

    # return [seed, store_id, secret_name]

@app.route('/generateUserKey', methods=['POST'])
def generate_userId():
    body = request.get_json()
    seed = body.get("seed")
    user_id = asyncio.run(generate_userId_func(seed))


    return user_id


@app.route('/storeProgram', methods=['POST'])
def storing_program():
    body = request.get_json()
    programOwnerSeed = body.get("programOwnerSeed")
    store_id = asyncio.run(storing_program_func(programOwnerSeed))
    return store_id


@app.route('/storeVote', methods=['POST'])
def storing_vote():
    body = request.get_json()
    programId = body.get("programId")
    seed = body.get("seed")
    vote_value = body.get("vote_value")
    programOwnerSeed = body.get("programOwnerSeed")
    secret_name = body.get("secret_name")
    stored_secret = asyncio.run(storing_vote_func(programId, seed, vote_value, programOwnerSeed, secret_name))
    return jsonify(stored_secret)

@app.route('/compute', methods=['POST'])
def compute():
    body = request.get_json()
    stored_secret_ids = body.get("stored_secret_ids")
    subOrganisersSeed = body.get("subOrganisersSeed")
    participantSeed = body.get("participantSeed")
    programId = body.get("programId")
    result = asyncio.run(compute_func(stored_secret_ids, subOrganisersSeed, participantSeed, programId))
    return jsonify(result)

@app.route('/retrieveSecret', methods=['POST'])
def retrieve_secret():
    body = request.get_json()
    store_id = body.get("store_id")
    secret_name = body.get("secret_name")
    seed = body.get("seed")
    result = asyncio.run(retrieve_secret_func(seed, store_id, secret_name))
    return jsonify(result)



if __name__ == '__main__':
    app.run(debug=True, port=6969)
