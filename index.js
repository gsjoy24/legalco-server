const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

// for mailing
const api_key = process.env.SEND_GRID_KEY;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(api_key);

// middlewares
app.use(cors());
app.use(express.json());

app.listen(port, () => {
	console.log(`server is running on ${port} for Legalco`);
});

app.get('/', (req, res) => {
	res.send(`server is running for Legalco`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@cluster0.bivrpo6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		client.connect();

		// * collections
		const appointmentCollection = client.db('Legalco').collection('appointments');
		const adminCollection = client.db('Legalco').collection('admins');
		const blogCollection = client.db('Legalco').collection('blogs');
		const lawyerCollection = client.db('Legalco').collection('lawyer');
		const serviceCollection = client.db('Legalco').collection('services');
		const reviewCollection = client.db('Legalco').collection('reviews');
		const lawyerAppointmentsCollection = client.db('Legalco').collection('lawyerappointments');

		// ! for appointments
		// add appointments
		app.post('/appointments', async (req, res) => {
			const newAppointment = req.body;
			const result = await appointmentCollection.insertOne(newAppointment);
			res.send(result);
		});

		// get all appointments
		app.get('/appointments', async (req, res) => {
			const result = await appointmentCollection.find().toArray();
			res.send(result);
		});

		// get single appointment
		app.get('/appointments/:id', async (req, res) => {
			const query = { _id: new ObjectId(req.params.id) };
			const result = await appointmentCollection.findOne(query);
			res.send(result);
		});

		// delete an appointment
		app.delete('/appointments/:id', async (req, res) => {
			const query = { _id: new ObjectId(req.params.id) };
			const result = await appointmentCollection.deleteOne(query);
			res.send(result);
		});

		// update an appointment
		app.patch('/appointments/:id', async (req, res) => {
			const query = { _id: new ObjectId(req.params.id) };
			const updatedAppointment = req.body;
			const result = await appointmentCollection.updateOne(query, {
				$set: updatedAppointment
			});
			res.send(result);
		});

		// ! for admins
		// add admin
		app.post('/admins', async (req, res) => {
			const newAdmin = req.body;
			const result = await adminCollection.insertOne(newAdmin);
			res.send(result);
		});

		// get all admins
		app.get('/admins', async (req, res) => {
			const result = await adminCollection.find().toArray();
			res.send(result);
		});

		// get an admin
		app.get('/admins/:email', async (req, res) => {
			const email = req.params.email;
			const query = { email };
			const result = await adminCollection.findOne(query);
			res.send(result);
		});

		// delete an admin
		app.delete('/admins/:email', async (req, res) => {
			const email = req.params.email;
			const query = { email };
			const result = await adminCollection.deleteOne(query);
			res.send(result);
		});

		// toggle admin role
		app.patch('/toggle-admin-role/:email', async (req, res) => {
			const email = req.params.email;
			const query = { email };
			const admin = await adminCollection.findOne(query);
			if (!admin) {
				return res.send({ message: 'No admin found' });
			}
			const newRole = admin.role === 'admin' ? 'user' : 'admin';
			const result = await adminCollection.updateOne(query, { $set: { role: newRole } });
			res.send(result);
		});

		// ! for blogs
		// add blog
		app.post('/blogs', async (req, res) => {
			const blog = req.body;
			const result = await blogCollection.insertOne(blog);
			res.send(result);
		});

		// get all blogs
		app.get('/blogs', async (req, res) => {
			const result = await blogCollection.find().toArray();
			res.send(result);
		});

		// get single blog
		app.get('/blogs/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await blogCollection.findOne(query);
			res.send(result);
		});

		// delete a blog
		app.delete('/blogs/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await blogCollection.deleteOne(query);
			res.send(result);
		});

		// update a blog
		app.put('/blogs/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const updatedBlog = req.body;
			const result = await blogCollection.updateOne(query, { $set: updatedBlog });
			res.send(result);
		});

		// ! for lawyer
		// add lawyer
		app.post('/lawyers', async (req, res) => {
			const lawyer = req.body;
			const result = await lawyerCollection.insertOne(lawyer);
			res.send(result);
		});

		// get all lawyers
		app.get('/lawyers', async (req, res) => {
			const result = await lawyerCollection.find().toArray();
			res.send(result);
		});

		// get single lawyer
		app.get('/lawyers/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await lawyerCollection.findOne(query);
			res.send(result);
		});

		// delete a lawyer
		app.delete('/lawyers/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await lawyerCollection.deleteOne(query);
			res.send(result);
		});

		// update a lawyer
		app.put('/lawyers/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const updatedLawyer = req.body;
			const result = await lawyerCollection.updateOne(query, { $set: updatedLawyer });
			res.send(result);
		});

		// ! for services
		app.post('/services', async (req, res) => {
			const service = req.body;
			const result = await serviceCollection.insertOne(service);
			res.send(result);
		});

		// get all services
		app.get('/services', async (req, res) => {
			const result = await serviceCollection.find().toArray();
			res.send(result);
		});

		// get single service
		app.get('/services/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await serviceCollection.findOne(query);
			res.send(result);
		});

		// delete a service
		app.delete('/services/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await serviceCollection.deleteOne(query);
			res.send(result);
		});

		// update a service
		app.put('/services/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const updatedService = req.body;
			const result = await serviceCollection.updateOne(query, { $set: updatedService });
			res.send(result);
		});

		// ! for review
		// add review
		app.post('/reviews', async (req, res) => {
			const review = req.body;
			const result = await reviewCollection.insertOne(review);
			res.send(result);
		});

		// get all reviews
		app.get('/reviews', async (req, res) => {
			const result = await reviewCollection.find().toArray();
			res.send(result);
		});

		// get single review
		app.get('/reviews/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await reviewCollection.findOne(query);
			res.send(result);
		});

		// delete a review
		app.delete('/reviews/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await reviewCollection.deleteOne(query);
			res.send(result);
		});

		// update a review
		app.put('/reviews/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const updatedReview = req.body;
			const result = await reviewCollection.updateOne(query, { $set: updatedReview });
			res.send(result);
		});

		// ! for lawyer Appointments
		// add lawyer appointments
		app.post('/lawyerAppointments', async (req, res) => {
			const appointment = req.body;
			const result = await lawyerAppointmentsCollection.insertOne(appointment);
			res.send(result);
		});

		// get all lawyer appointments
		app.get('/lawyerAppointments', async (req, res) => {
			const result = await lawyerAppointmentsCollection.find().toArray();
			res.send(result);
		});

		// get single lawyer appointment
		app.get('/lawyerAppointments/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await lawyerAppointmentsCollection.findOne(query);
			res.send(result);
		});

		// delete a lawyer appointment
		app.delete('/lawyerAppointments/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await lawyerAppointmentsCollection.deleteOne(query);
			res.send(result);
		});

		// update a lawyer appointment
		app.put('/lawyerAppointments/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const updatedAppointment = req.body;
			const result = await lawyerAppointmentsCollection.updateOne(query, { $set: updatedAppointment });
			res.send(result);
		});

		// ! send mail
		app.post('/mail-to-lawyer', async (req, res) => {
			const { name, email, phone, lawyerName, serviceInfo, lawyerContactInfo } = req.body;
			const msg = {
				to: { email }, // Change to your recipient
				from: 'meetplanr@gmail.com', // Change to your verified sender
				subject: `${name} Request for a Appointment to our lawyer ${lawyerName}`,
				text: 'Confirmation mail for a Appointment',
				html: `<div style="max-width: 500px; width: 96%; margin: 0 auto; border: 1px solid #777; padding: 20px; background: rgba(0, 0, 255, 0.1); font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; border-radius: 10px;">
        <h2 style=" margin: 0; text-align: center">Applicant Information.</h2>
		  <hr/>
        <h4 style="margin-bottom: 5px;">Applicant Name:</h4>
        <p style=" margin: 0;">${name}</p>
        <h4 style="margin-bottom: 5px;">Applicant Email:</h4>
        <p style=" margin: 0;">${email}</p>
        <h4 style="margin-bottom: 5px;">Applicant Phone:</h4>
        <p style=" margin: 0;">${phone}</p>
        <h4 style="margin-bottom: 5px;">Service Description:</h4>
        <p>${serviceInfo}</p>

        <h2 style=" margin: 0; text-align: center">Lawyer Information.</h2>
		   <hr/>
        <h4 style="margin-bottom: 5px;">Lawyer Name:</h4>
        <p style=" margin: 0;">${lawyerName}</p>
        <h4 style="margin-bottom: 5px;">Lawyer Email:</h4>
        <p style=" margin: 0;">${lawyerContactInfo?.email}</p>
        <h4 style="margin-bottom: 5px;">Lawyer Phone:</h4>
        <p style=" margin: 0;">${lawyerContactInfo?.phone}</p>
    </div>`
			};

			sgMail
				.send(msg)
				.then(() => {
					return res.json({
						message: 'Message sent successfully!',
						status: 200
					});
				})
				.catch((error) => {
					console.log(error);
					console.error({
						message: 'Something went wrong...',
						status: 500
					});
				});
		});

		// Send a ping to confirm a successful connection
		await client.db('admin').command({ ping: 1 });
		console.log('Pinged your deployment. You successfully connected to MongoDB!');
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);
